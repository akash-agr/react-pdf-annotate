import { createSlice } from "@reduxjs/toolkit"

const sharePDF = createSlice({
    name: "sharePDF", 
    
    initialState: {   

        searchString: '', 
        Url: null,
        currentPageNumber: 1, 
        pdfProgress: 5,
        scale: 1,
        rotateAngle: 0,
        numPages: null, 

        pdfViewer: null, 
        pdfFindController: null, 

        pdfError: false,
        randomNumber: 0, 
        apiLoading: false, 

        containerId: 'sharepdf-pages',
        pageFit: 'height',
    }, 

    reducers: {
        //API 
        startLoadingAPI:(state,action) => {
            state.apiLoading = true
        },

        setUrlAndQueryString:(state,action)=> {
           const {urlTemp, queryTemp, currentPageNumberTemp, pageNumberArrayTemp, highlightedTextArrayTemp, currentDocumentoffsetArrayTemp, pdfNameTemp}  = action.payload 
           state.Url = urlTemp;
           state.searchString = queryTemp;
           state.currentPageNumber = parseInt(currentPageNumberTemp)
           state.PageNumberArray = pageNumberArrayTemp
           state.HighlightedTextArray = highlightedTextArrayTemp
           state.currentDocumentoffsetArray = currentDocumentoffsetArrayTemp
           state.pdfName = pdfNameTemp
           state.apiLoading = false
           state.randomNumber = Math.random()            
        },  

        clearPdfViewer:(state, action)=> {            
            state.pdfViewer = null;
            state.pdfFindController = null;
        },
        
        //PDF
        updateProgressBar:(state, action)=> {
            const {progress} = action.payload;
            state.pdfProgress = progress ;
        }, 
        
        setNumPages:(state, action)=> {
            const {_pdf} = action.payload;
            state.pdf = _pdf;
            state.numPages = _pdf.numPages;
        },

        setPdfViewer:(state, action)=> {
            const {_pdfViewer, _pdfFindController} = action.payload;
            state.pdfViewer = _pdfViewer;
            state.pdfFindController = _pdfFindController;
        },

        onChangePageSlice: (state, action) => {
            const {newPageNum} = action.payload;  
            if ( newPageNum  > 0 && newPageNum <= state.numPages) {
                state.currentPageNumber = newPageNum;
                state.pdfViewer.currentPageNumber = Number(newPageNum);  
            }          
        }, 

        setNumPagesToNull:(state, action)=> {
            state.numPages = null;
            state.currentPageNumber = null;
            state.pdfProgress = 1;
        }, 

        changePageOnScrollSlice: (state, action) => {
            const {newPageNum} = action.payload;  
            if ( newPageNum > 0 && newPageNum <= state.numPages) {
                state.currentPageNumber = newPageNum;
                localStorage.setItem('currentPageNumberPreference', JSON.stringify(newPageNum));                                                             
            }          
        }, 

        onFocusPageInputSlice:(state, action)=> {
            state.pageInputFocus = true;        
        }, 

        onZoomInSlice:(state)=> {
            if(state.pdfViewer && state.scale < 3.0) {
                state.pdfViewer.currentScale = Number(state.pdfViewer.currentScale  *1.1);            
                state.pdfViewer.currentPageNumber = Number(state.currentPageNumber);                  
            } else { console.log("onZoomIn: pdfViewer not defined") }
        },
        
        onZoomOutSlice:(state, action)=> {
            if(state.pdfViewer && state.scale > 0.25) {                
                state.pdfViewer.currentScale = Number(state.pdfViewer.currentScale  / 1.1);            
                state.pdfViewer.currentPageNumber = Number(state.currentPageNumber);  
            } else { console.log("onZoomOut: pdfViewer not defined") }
        },  

        onRotateSlice:(state, action)=> { 
            if(state.pdfViewer) {
             state.pdfViewer.pagesRotation = state.rotateAngle % 360 + 90;            
             state.rotateAngle = state.rotateAngle % 360 + 90;
            } else { console.log("onRotate: pdfViewer not defined") }   
        }, 
        
        changePageFitSlice: (state, action)=> { 
            if(state.pdfViewer) {
                console.log(document.getElementById('pdfOuterPageId').clientWidth,  document.getElementById('pdfOuterPageId').clientHeight) 
                console.log(state.pdfViewer)
                // if(state.pageFit == 'height') {
                //     console.log('Inside Height')
                //     state.pdfViewer.currentScaleValue = 'page-width';
                //     state.pageFit = 'width';
                // }
                // else if(state.pageFit == 'width') {
                //     state.pdfViewer.currentScaleValue = 'page-height';
                //     console.log('Inside width')
                //     state.pageFit = 'height';
                // } 
            } 
        }, 

    } 
})  

export const {startLoadingAPI, setUrlAndQueryString, clearPdfViewer,  
             pageUpSlice, pageDownSlice,  updateProgressBar, setNumPages, setPdfViewer, setNumPagesToNull, onChangePageSlice, changePageOnScrollSlice, onFocusPageInputSlice , 
             onZoomInSlice, onZoomOutSlice, onRotateSlice, changePageFitSlice} = sharePDF.actions

export default sharePDF.reducer