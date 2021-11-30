import React, { useState, useEffect, useCallback} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { PDFJS } from 'pdfjs-dist/web/pdf_viewer';
import {updateProgressBar, setNumPages, setNumPagesToNull, setPdfViewer, onChangePageSlice, changePageOnScrollSlice} from "../features/SharePDFSlice.js"
import './PDFPage.scss'
import axios from 'axios'
import matchesAll from "../matches.js";
// import debounce from "lodash.debounce";
import {
  asElement,
  getPageFromRange,
  getPageFromElement,
  getWindow,
  findOrCreateContainerLayer,
  isHTMLElement,
} from "./lib/pdfjs-dom";
import getBoundingRect from "./lib/get-bounding-rect";
import getClientRects from "./lib/get-client-rects";
import { scaledToViewport, viewportToScaled } from "./lib/coordinates"; 

const _ = require("underscore");
const { debounce } = _ 

 
PDFJS.workerSrc =  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.338/pdf.worker.js';  // saved as pdf.worker.js


const PDFPage = ({}) => {
    
  
  const dispatch = useDispatch()
  
  var {pdfViewer, currentPageNumber, randomNumber, currentDocumentoffsetArray} = useSelector((state) => state.sharePDF)
  var _pdfLinkService, _pdfViewer, _pdfFindController;
  var currentPageNumber =1 
  var currentDocumentoffsetArray = []
  var randomNumber = 0

  const [state, setState] = useState({})

  var PageView = true 
  
  const [rendered, setRendered] = useState(false);  

  function renderMatches(matches, textContentItemsStr, textDivs, pageIdx) {
    if (matches.length === 0) {
      return;
    }
    
    var prevEnd = null;    
    var infinity = { divIdx: -1, offset: undefined};
    
    function beginText(begin, className) {
      var divIdx = begin.divIdx;
      if(textDivs[divIdx]) {
        textDivs[divIdx].textContent = '';
        appendTextToDiv(divIdx, 0, begin.offset, className); 
      }
    }

    function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
      if(!textContentItemsStr[divIdx]) {
        return
      }
      var div = textDivs[divIdx];
      var content = textContentItemsStr[divIdx].substring(fromOffset, toOffset);
      var node = document.createTextNode(content);
      if (className) {
        var span = document.createElement('span');
        span.className = className;
        // console.log(className)
        span.appendChild(node);
        div.appendChild(span);
        return;
      }
      div.appendChild(node);
    }
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      var begin = match.begin;
      var end = match.end;
      var highlightSuffix =  match.type ? ' ' + match.type : '' // isSelected ? ' selected' : '';
      // console.log(highlightSuffix) 
      
      if (!prevEnd || begin.divIdx !== prevEnd.divIdx) { // first time 
        if (prevEnd !== null) {
          appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
        }
        beginText(begin);
      } else {
        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
      }
      // appending text to nodes 
      if (begin.divIdx === end.divIdx) { // simple case with same begin and end divs
        appendTextToDiv(begin.divIdx, begin.offset, end.offset, 'highlight' + highlightSuffix);
      } else {
        appendTextToDiv(begin.divIdx, begin.offset, infinity.offset, 'highlight begin' + highlightSuffix);
        for (var n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
          if( textDivs[n0]) {
            textDivs[n0].className = 'highlight middle' + highlightSuffix;
          }
        }
        beginText(end, 'highlight end' + highlightSuffix);
      }
      prevEnd = end;
    }
    if (prevEnd) {
      appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
    }
  }

  const afterSelection = (isCollapsed, range) => { 
    // console.log(range)
    // const { onSelectionFinished } = this.props;

    // const { isCollapsed, range } = state;
    // console.log(range)
    if (!range || isCollapsed) {
      return;
    }
    var string = 'hat is number one. Number two is we'
    // console.log(string[21])
    // console.log(range, range.startContainer, range.startContainer.parentNode) 
    // var parentElement = range.startContainer.parentNode.parentNode

    var pageIdx = getPageFromRange(range).number -1;
    var startDiv= range.startContainer.parentNode 
    var beginIndex = Array.from(startDiv.parentNode.children).indexOf(startDiv)
    var beginOffset = range.startOffset
    var endDiv= range.endContainer.parentNode     
    var endIndex = Array.from(endDiv.parentNode.children).indexOf(endDiv)
    var endOffset = range.endOffset
    // console.log({range, pageIdx, beginIndex, beginOffset, endIndex, endOffset})
    // console.log(startDiv.className) 
    // console.log(startDiv.nextUntil(endDiv))



    if (startDiv.className == 'textLayer') {
      console.log(startDiv.className) 
      return ; // very important to stop creating lines in begining of page  // appending span to text layer 
    }
    
    var className = 'highlight line'
    // if (startDiv.tagName == 'DIV' && endDiv.tagName == 'DIV') {
      if (startDiv == endDiv){
          var contentStart =  startDiv.textContent.substring(0, beginOffset) //.substring(beginOffset, endOffset) ; //textContentItemsStr[divIdx].substring(fromOffset, toOffset);
          var contentMiddle = startDiv.textContent.substring(beginOffset, endOffset)
          var contentEnd = startDiv.textContent.substring(endOffset, startDiv.textContent.length)      
          startDiv.textContent = ''
          var node = document.createTextNode(contentStart + contentMiddle + contentEnd);  
          var nodeStart = document.createTextNode(contentStart);  
          var nodeMiddle = document.createTextNode(contentMiddle);  
          var nodeEnd = document.createTextNode(contentEnd);  
          var spanStart = document.createElement('span');
          var spanMiddle = document.createElement('span');
          var spanEnd = document.createElement('span');
          spanStart.appendChild(nodeStart); 
          spanMiddle.appendChild(nodeMiddle); 
          spanEnd.appendChild(nodeEnd); 
          spanMiddle.className = className;
          startDiv.appendChild(spanStart); 
          startDiv.appendChild(spanMiddle); 
          startDiv.appendChild(spanEnd); 
          // startDiv.appendChild(node);
          // console.log('DIV', startDiv.parentNode)
        }  
      else {
        // start div 
        var contentStart =  startDiv.textContent.substring(0, beginOffset) //.substring(beginOffset, endOffset) ; //textContentItemsStr[divIdx].substring(fromOffset, toOffset);
        var contentEnd = startDiv.textContent.substring(beginOffset, startDiv.textContent.length)      
        startDiv.textContent = ''
        var nodeStart = document.createTextNode(contentStart);  
        var nodeEnd = document.createTextNode(contentEnd);  
        var spanStart = document.createElement('span');
        var spanEnd = document.createElement('span');
        spanStart.appendChild(nodeStart); 
        spanEnd.appendChild(nodeEnd); 
        spanEnd.className = className;
        startDiv.appendChild(spanStart); 
        startDiv.appendChild(spanEnd); 

        // middle divs
        var parentNode = startDiv.parentNode 
        // console.log(startDiv)
        for(let i=beginIndex+1; i<endIndex; i++) {
          try {
            // console.log(parentNode.children[i]) 
            parentNode.children[i].className = className 
          } catch(e) {
          }
        }
        // console.log(endDiv)

        // end divs 
        var contentStart =  endDiv.textContent.substring(0, endOffset) //.substring(beginOffset, endOffset) ; //textContentItemsStr[divIdx].substring(fromOffset, toOffset);
        var contentEnd = endDiv.textContent.substring(endOffset, endDiv.textContent.length)      
        endDiv.textContent = ''
        var nodeStart = document.createTextNode(contentStart);  
        var nodeEnd = document.createTextNode(contentEnd);  
        var spanStart = document.createElement('span');
        var spanEnd = document.createElement('span');
        spanStart.appendChild(nodeStart); 
        spanEnd.appendChild(nodeEnd); 
        spanStart.className = className;
        endDiv.appendChild(spanStart); 
        endDiv.appendChild(spanEnd); 
      }  
    // }


    // var pages = _pdfViewer._pages 
    // var textContentItemsStr = pages[pageIdx].textLayer.textContentItemsStr
    // var textDivs = pages[pageIdx].textLayer.textDivs
    // var matches = [ 
    //   {
    //     "begin": {
    //         "offset": beginOffset,
    //         "divIdx": beginIndex
    //     },
    //     "end": {
    //         "offset": endOffset,
    //         "divIdx": endIndex, 
    //     },
    //     "pageIndex": pageIdx,
    //     "type": "line"
    //   }
    // ]
    // console.log(matches)
    // renderMatches(matches, textContentItemsStr, textDivs, pageIdx)

    // var className = 'highlight line'

    // if(beginIndex == endIndex) {
    //   var content =  startDiv.textContent.substring(beginOffset, endOffset) ; //textContentItemsStr[divIdx].substring(fromOffset, toOffset);
    //   var contentStart = startDiv.textContent.substring(0, beginOffset)
    //   // console.log(contentStart, 'this', content) 
    //   // check if child already present or not  
    //   console.log(contentStart, 'this', content,  startDiv.childElementCount)

    //   var node = document.createTextNode(content); 
    //   startDiv.textContent = contentStart
    //   if (className) { 
    //     var span = document.createElement('span');
    //     span.className = className;
    //     span.appendChild(node);
    //     startDiv.appendChild(span);
    //     return;
    //   } 
    // }

    // var content =  startDiv.textContent //.substring(beginOffset, endOffset) ; //textContentItemsStr[divIdx].substring(fromOffset, toOffset);
    // var contentStart = startDiv.textContent.substring(0, beginOffset)

    // console.log({contentStart,  content}) //,  startDiv.childElementCount)
    
    // if(startDiv.childElementCount ==0) {
    //   startDiv.textContent = contentStart
    //   var node = document.createTextNode(content); 
    //   var span = document.createElement('span');
    //   span.className = className;
    //   span.appendChild(node);
    //   startDiv.appendChild(span);
    //   startDiv.appendChild(node);
    //   console.log('1' ,startDiv)
    // } else if(startDiv.childElementCount ==1){
    //   startDiv.textContent = contentStart
    //   var childDiv = startDiv.firstChild
    //   console.log('2', startDiv, childDiv)
    //   // childDiv.textContent = content
    // }

    // if (className) { 
    //   startDiv.textContent = ''
    //   var node = document.createTextNode(content);  
    //   var span = document.createElement('span');
    //   span.className = className;
    //   span.appendChild(node);
    //   startDiv.appendChild(span);
    //   // return;
    // } 
    // console.log(startDiv.tagName)  // , startDiv.parentNode) 
    // if (beginIndex == endIndex) {
    //   if (startDiv.tagName == 'DIV') {
    //     var contentStart =  startDiv.textContent.substring(0, beginOffset) //.substring(beginOffset, endOffset) ; //textContentItemsStr[divIdx].substring(fromOffset, toOffset);
    //     var contentMiddle = startDiv.textContent.substring(beginOffset, endOffset)
    //     var contentEnd = startDiv.textContent.substring(endOffset, startDiv.textContent.length)      
    //     startDiv.textContent = ''
    //     var node = document.createTextNode(contentStart + contentMiddle + contentEnd);  
    //     var nodeStart = document.createTextNode(contentStart);  
    //     var nodeMiddle = document.createTextNode(contentMiddle);  
    //     var nodeEnd = document.createTextNode(contentEnd);  
    //     var spanStart = document.createElement('span');
    //     var spanMiddle = document.createElement('span');
    //     var spanEnd = document.createElement('span');
    //     spanStart.appendChild(nodeStart); 
    //     spanMiddle.appendChild(nodeMiddle); 
    //     spanEnd.appendChild(nodeEnd); 
    //     spanMiddle.className = className;
    //     startDiv.appendChild(spanStart); 
    //     startDiv.appendChild(spanMiddle); 
    //     startDiv.appendChild(spanEnd); 
    //     // startDiv.appendChild(node);

    //     console.log('DIV', startDiv.parentNode)
    //   } else if (startDiv.tagName == 'SPAN') {
    //     console.log('SP', range, startDiv.parentNode) 
    //     // console.log(startDiv, startDiv.previousElementSibling, startDiv.parentNode)

    //   } else {
    //     //console.log('Nothing')
    //   }
    // }
    // div.appendChild(node);


    // console.log(range,div.parentNode, Array.from(div.parentNode.children).indexOf(div))
    // console.log(div.parentNode.childElementCount)

    // const page = getPageFromRange(range);
    
    // if (!page) {
    //   return;
    // }
    // // // console.log(page)
    // const rects = getClientRects(range, page.node);
    // console.log(rects)
    // // if (rects.length === 0) {
    // //   return;
    // // }

    // const boundingRect = getBoundingRect(rects);

    // const viewportPosition = { boundingRect, rects, pageNumber: page.number };
    // // console.log({viewportPosition})
    // var content = {
    //   text: range.toString(),
    // };

    // const viewportPositionToScaled  = ({ pageNumber,boundingRect, rects}) => {
    //   const viewport = _pdfViewer.getPageView(pageNumber - 1).viewport;

    //   return {
    //     boundingRect: viewportToScaled(boundingRect, viewport),
    //     rects: (rects || []).map((rect) => viewportToScaled(rect, viewport)),
    //     pageNumber,
    //   };
      
    // }
    // // console.log({_pdfViewer, pdfViewer})

    // const scaledPosition = viewportPositionToScaled(viewportPosition);
    // console.log({scaledPosition})

    // this.setTip(
    //   viewportPosition,
    //   onSelectionFinished(
    //     scaledPosition,
    //     content,
    //     () => this.hideTipAndSelection(),
    //     () =>
    //       this.setState(
    //         {
    //           ghostHighlight: { position: scaledPosition },
    //         },
    //         () => this.renderHighlights()
    //       )
    //   )
    // );
  };
  // const debouncedAfterSelection = useCallback(debounce(afterSelection, 80), []); 
  
  useEffect(() => { 
    
    // if (!rendered){
    //   setRendered(true);
    //   return  null       
    // }     


    dispatch(setNumPagesToNull())    
    var Url = 'https://finsightai.sgp1.digitaloceanspaces.com/ConferenceCall/TATACONSUM/2021Jun.pdf'
    if (Url) { 
        // console.log('Url', Url)   
        // if(pdfViewer){pdfViewer._resetView()} 
        // Url = 'https://thesis-application.s3.ap-south-1.amazonaws.com/IHCL.pdf' // https://thesis-application.s3.ap-south-1.amazonaws.com/ConCall.pdf
                
        var apiUrl =   process.env.REACT_APP_Environment === 'development' ? 'https://finsight.ai/api/utils/getFileSize'  :  '/api/utils/getFileSize'    // 'http://localhost:5000/api/alerts/Keywordfilings' 
        var fileSize 
        // var PageView = false

        axios.post(apiUrl, {Url: Url})
        .then((res) => {
          fileSize = res.data.fileSize    
          // console.log({fileSize})   
                    
          var loadingTask = PDFJS.getDocument(Url) // .replace('sgp1.', 'sgp1.cdn.')
          
            loadingTask.onProgress = function(data){  //this is only for rendering          
              var progress = Math.round((data.loaded / (fileSize ? fileSize : 10000000)) * 100);
              // console.log(progress, {fileSize})
              dispatch(updateProgressBar({progress}));          
            }

            loadingTask.then((_pdf) => {  
              // console.log('_pdf', _pdf.numPages);     
              if(_pdf.numPages < 150) { PageView = false }  
              
              PDFJS.disableTextLayer = false;  
              PDFJS.externalLinkTarget = PDFJS.LinkTarget.PARENT; 
              
              // Scroll 
              _pdfLinkService = new PDFJS.PDFLinkService();  // PDF Link Service
                      
              if(PageView) {    
                _pdfViewer = new PDFJS.PDFSinglePageViewer({   // PDF Viewer 
                  container: document.getElementById('viewpdf-pages'), 
                  removePageBorders: true,
                  linkService: _pdfLinkService, 
                }); 
              } else {
                _pdfViewer = new PDFJS.PDFViewer({   // PDF Viewer 
                  container: document.getElementById('viewpdf-pages'), 
                  removePageBorders: true,
                  linkService: _pdfLinkService,
                }); 
              }

              _pdfLinkService.setViewer(_pdfViewer);

              // PDF Find Controller
              _pdfFindController = new PDFJS.PDFFindController({ pdfViewer: _pdfViewer });
              _pdfViewer.setFindController(_pdfFindController);
                        
              dispatch(setNumPages({_pdf}));
              if(_pdfViewer) {  
                // _pdfViewer.cleanup()
                _pdfViewer.setDocument(_pdf);} 
              if(_pdfLinkService) { _pdfLinkService.setDocument(_pdf, null);}     
              
              var docViewer = document.getElementById('pdfOuterPageId');      

              const onScrollCheck = () => {
                var SCROLL_TOP_PADDING = 500;
                // console.log('check_scroll')
                if (_pdfViewer) {
                  const { scrollTop, scrollHeight } = docViewer;
                  const newPageNum = Math.ceil((scrollTop + SCROLL_TOP_PADDING) / (scrollHeight / _pdf.numPages));
                  if (newPageNum != currentPageNumber){
                    dispatch(changePageOnScrollSlice({newPageNum}));                
                  }
                }
              }


              const onSelectionChange = (e) => {
                const container = document.getElementById('pdfOuterPageId')
                const selection = document.getSelection(); 
                const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null; 

                if (selection.isCollapsed) {
                  // this.setState({ isCollapsed: true });
                  return;
                }

                if ( !range || !container || !container.contains(range.commonAncestorContainer)) { 
                  // return if selection is outside of PDF
                  return;
                } 
                // console.log(range)
                afterSelection(selection.isCollapsed, range)
                // debouncedAfterSelection(selection.isCollapsed, range)

              }

              if (docViewer && !PageView) { 
                docViewer.addEventListener('scroll', onScrollCheck);
                // docViewer.addEventListener("selectionchange", onSelectionChange);
                // document.addEventListener("selectionchange", onSelectionChange);
                document.addEventListener("mouseup", onSelectionChange);
              }
              return _pdf;
            })
          .then((_pdf) => {
              dispatch(setPdfViewer({_pdfViewer, _pdfFindController})); 
              
            })      
          })      
    }

  },[])   
     

  return (
       <div></div>
    )
}

export default PDFPage



// console.log({_pdfViewer, _pdfFindController})
              // setTimeout(() => {           
              //   // console.log('scale', _pdfViewer.currentScaleValue)
              //   // _pdfViewer.currentScaleValue = 'page-fit'
              //   if(currentPageNumber) {    
              //     // console.log('newPageNum', currentPageNumber) 
              //     dispatch(onChangePageSlice({newPageNum:currentPageNumber}));                           
              //   }      
              // }, 200)

              // setTimeout(() => {                                                 
              //     _pdfFindController.executeCommand('find', {
              //       query: '',
              //       offsetArrayTinkered: currentDocumentoffsetArray,
              //     });   
              //     if(currentPageNumber) {              
              //       // console.log('newPageNum', currentPageNumber) 
              //       dispatch(onChangePageSlice({newPageNum : currentPageNumber}));     
              //     }    
              // }, 500)   

              // setTimeout(() => {  if(currentPageNumber) {              
                // console.log('newPageNum', currentPageNumber) 
                // var textContentItemsStrArray = _.map( pages, function(obj) {return obj})
                // for(let i=0; i<pages.length; i++)  {
                //   console.log(pages[i].textLayer.textContentItemsStr)
                // }   
                // dispatch(onChangePageSlice({newPageNum : currentPageNumber}));
                // var pages = _pdfViewer._pages 
                
                // // console.log({pages, matchesAll}) 
                // for(let i=0; i<matchesAll.length; i++) {
                //   try {
                //     var textContentItemsStr = pages[i].textLayer.textContentItemsStr
                //     var textDivs = pages[i].textLayer.textDivs
                //     var pageIdx = i
                //     var matches = _.filter(matchesAll, function(obj) {if (obj.pageIndex == i) {return obj}})
                //     console.log({matches, textContentItemsStr, textDivs, pageIdx}) 
                //     renderMatches(matches, textContentItemsStr, textDivs, pageIdx)
                //   } catch(e) {
                //     // var textContentItemsStr = []
                //   }
                
                // }                
                
              // } 
              // },1500)  
 


// console.log({currentDocumentoffsetArray})

// const highlight = () => {
//   setTimeout(() => {
//     _pdfFindController.executeCommand('find', { query: '',}) // to reset all  highlighted divs
//     _pdfFindController.executeCommand('find', {
//       query: '`',
//       offsetArrayTinkered : currentDocumentoffsetArray, //currentDocumentoffsetArray,
//       })
//   }, 500);
// }   


// onKeyDown={changePageOnLeftAndRightArrowKey} 

// console.log('test', document.getElementsByClassName('page'), document.getElementsByClassName('page')[0], heightTemp, window.innerHeight, document.getElementsByClassName('page')[0].scrollHeight);            
// document.getElementById('pdfOuterPageId').style.top = "115px";  
// if( document.getElementsByClassName('page') &&  document.getElementsByClassName('page')[0] && window.innerHeight > document.getElementsByClassName('page')[0].scrollHeight) {
//   heightTemp =  String((window.innerHeight -  document.getElementsByClassName('page')[0].scrollHeight)/3 + 110) + "px";
//   document.getElementById('pdfOuterPageId').style.top = "120px" ;
// } else {
//   heightTemp = "10px";
//   document.getElementById('pdfOuterPageId').style.top = "120px"; //heightTemp;
// }     

// const xhr = new XMLHttpRequest();
// xhr.open('GET', Url);
// xhr.responseType = 'arraybuffer';

// xhr.onprogress = (e) => {  // pdf loading takes lot of time 
//   if (e.lengthComputable) {
//     var progress = Math.round((e.loaded / e.total) * 100);
//     dispatch(updateProgressBar({progress}));
//   }
// };


// xhr.onload = () => {      
// const pdf = xhr.response;

// };
      
// xhr.onerror = () => {
//   console.error('Error while requesting', Url);
// };

// xhr.send();



// var _textDivs = [] , _textContentItemsStr = [], _pageContents= [];  
// var counter = 0;
// var pageViewsReady = false;
// while (!pageViewsReady) {  
//   console.log(counter, _pdfViewer , _pdfViewer._pages , _pdfViewer._pages[0].textLayer , _pdfViewer._pages[0].textLayer.renderingDone)

//   if(_pdfViewer && _pdfViewer._pages && _pdfViewer._pages.textLayer && _pdfViewer._pages.textLayer.renderingDone===true) {
//     // console.log(counter, _pdfViewer , _pdfViewer._pages , _pdfViewer._pages.textLayer , _pdfViewer._pages.textLayer.renderingDone)
//     pageViewsReady = true;
//     highlight()
//   }
//   if (counter >= 100) {
//     break;
//   }
//   counter = counter + 1; 
//   sleep(20)
// }
// xhr.onprogress = (e) => {
//   if (e.lengthComputable) {
//     // const percent = Math.round((e.loaded / e.total) * 100);
//     // dispatch(updateProgressBar({percent}));
//   }
// };

// loadingTask.onProgress = function(data){  //this is only for rendering
//   progress = Math.round((data.loaded / data.total) * 100);
//   dispatch(updateProgressBar({progress}));          
// }

// return textLayerReady()

// .then((_pdf) => {
//   console.time();
//   var arrayPromises = []
//   for(let i =0;  i< _pdf.numPages; i++) {     
//     var response = _pdfViewer.getPageTextContent(i)  
//     arrayPromises.push(response)
//   }
//   return Promise.all(arrayPromises)          
// })
// .then((textContents) => {
//   var pageContents =[];  
//   _.each(textContents, function(textContent) { 
//       var string = ''
//       _.each(textContent.items, function(item) {
//         string = string + item.str
//       })    
//       pageContents.push(string)
//   })

//   console.log(pageContents)
//   dispatch(setPageContents({pageContents}))
//   return pageContents
// })


// function checkReady() {
//   if(_pdfViewer.pageViewsReady===false){
//     console.log('a', _pdfViewer.pageViewsReady )
//     window.setTimeout(checkReady, 100);
//   } else {
//     console.log('b', _pdfViewer.pageViewsReady )
//   }
// }


// async function pageViewsReady() {
// // let counter = 0;
// for(let i=0; i<20; i++) {
//   await waitForMillis(200);
//   if (_pdfViewer.pageViewsReady) {
//     return Promise.resolve(true)   
//   }
// }
// return Promise.reject(false)
// }

// async function textLayerReady() {
//   // let counter = 0;
//   for(let i=0; i< 500; i++) {
//     await waitForMillis(200);
//     if (_pdfViewer.pageViewsReady) {
//       let textLayerCountFlag =  0;
//       for(let j=0; j<_pdfViewer._pages.length; j++){
//           if(_pdfViewer._pages[j].textLayer != null && _pdfViewer._pages[j].textLayer.renderingDone===true){
//             textLayerCountFlag = textLayerCountFlag + 1
//             // console.log('textLayerCountFlag', textLayerCountFlag, _pdfFindController.active)
//           }   
//       }
//       if(textLayerCountFlag===_pdfViewer._pages.length) { //&& _pdfFindController.active===true
//         return Promise.resolve(true)   
//       }
//     }
//   }
//   return Promise.reject(false)
// }

// function waitForMillis(millisWait){
//   return new Promise((resolve, reject)=>{
//       setTimeout(()=>{resolve(true)}, millisWait)
//   })
// }


// console.log(_pdfViewer._pages[0].textLayer); 
// console.timeEnd()
// for(let i=0; i<_pdfViewer._pages.length; i++){
//   _textContentItemsStr.push(_pdfViewer._pages[i].textLayer.textContentItemsStr);          
//   _textDivs.push(_pdfViewer._pages[i].textLayer.textDivs);          
// }
// console.log('_pdfViewer', _pdfViewer)
// _.each(_textContentItemsStr, function(textContent) { 
//     var string = textContent.join('')
//     _pageContents.push(string)
// })
// dispatch(setPageContents({_pageContents, _textContentItemsStr, _textDivs}))
