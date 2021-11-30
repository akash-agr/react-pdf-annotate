import React, { useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ProgressBar from "./ProgressBar/ProgressBar";
import PDFPage from "./PDFPage/PDFPage";
// import Toolbox from "./ToolBox/ToolBox";
// import SideBar from "./SideBar/TextModal/TextModal";
// import modal_styles from "./modal.module.css";
// import {
//   startLoadingAPI,
//   clearPdfViewer,
//   setUrlAndQueryString,
//   onChangePageSlice,
// } from "./features/SharePDFSlice.js";
// import axios from "axios";
// import { Link, useHistory, useLocation } from "react-router-dom";
import { CloseIcon } from "./assets/svg";
import "./ViewPDF.css";
// const _ = require("underscore");
import { enableRect, disableRect } from "./PDFannotate/rect";

const ViewPDF = () => {
  // const [currentTool, setCurrentTool] = useState(null);
  const tool = useRef(null);
  const [viewport, setViewport] = useState(null);

  function handleClick(e) {
    if (tool.current) {
      disableRect(tool.current.id);
    }
    // change tool
    const parent = e.target.closest(".annontation-tool");
    tool.current?.classList.remove("annotation-selected");
    if (tool.current === parent) {
      tool.current = null;
      return;
    }
    tool.current = parent;
    tool.current.classList.add("annotation-selected");

    // let pageComponent = document.querySelectorAll(".page")[0];
    // let childNodes = [...pageComponent.childNodes];

    // let containsSVG = childNodes.some(
    //   (node) => node.tagName === "SVG" || node.tagName === "svg"
    // );

    // if (!containsSVG) {
    //   // create svg for all pages
    //   [...document.querySelectorAll(".page")].forEach((page, i) => {
    //     createSvg(page, i);
    //   });
    // }

    switch (tool.current.id) {
      case "highlight":
        break;
      case "underline":
        enableRect("underline");
        break;
      case "strikeout":
        enableRect("strikeout");
        break;
      case "squiggly":
        break;
      case "area":
        enableRect("area");
        break;
      case "textbox":
        break;
      case "eraser":
        break;
      default:
        break;
    }
  }



  return (
    <div>

        {/* <Toolbox /> */}

        <div className="pdfOuterPage" id="pdfOuterPageId">
          <div className={`pdfViewer`} id="pdfViewerId">
            {true && (
              <div id="viewpdf-pages" tabIndex="0">
                {" "}
                <PDFPage setViewport={setViewport} />{" "}
              </div>
            )}
          </div>
        </div>

        <div className="annotations">
          {/* highlight */}
          <button
            className="annontation-tool"
            id="highlight"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              className="icon"
              viewBox="0 0 24 24"
            >
              <path
                className="cls-1"
                d="M9.91,13.07h3.86L11.84,8.46Zm5.46,3.68L14.62,15H9.05L7.77,18H5.63L10.45,6.64a1,1,0,0,1,1-.64h1a1.23,1.23,0,0,1,1,.64l2,4.91V4H5.85A2.22,2.22,0,0,0,3.63,6.22V17.78A2.22,2.22,0,0,0,5.85,20h9.52Z"
              ></path>
              <path
                fill="default"
                className="cls-1"
                d="M20.37,2V22h-2V2Z"
              ></path>
            </svg>
          </button>

          {/* underline */}
          <button
            className="annontation-tool"
            id="underline"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="icon bi bi-type-underline"
              viewBox="0 0 20 20"
            >
              <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
            </svg>
          </button>

          {/* strikethrough */}
          <button
            className="annontation-tool"
            id="strikeout"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="icon bi bi-type-strikethrough"
              viewBox="0 0 20 20"
            >
              <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
            </svg>
          </button>

          {/* squiggly */}
          <button
            className="annontation-tool"
            id="squiggly"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              className="icon"
            >
              <path d="M21.754 12.013c-1.438 0-1.19-5.013-2.971-5.013-1.689 0-1.432 6.223-2.388 8.545-.039.095-.13.156-.232.156-.104 0-.197-.063-.234-.162-.886-2.323-.833-8.539-2.534-8.539-1.741 0-1.667 5.947-2.54 8.448-.036.102-.129.168-.238.168-.107 0-.2-.065-.237-.166-.867-2.407-.809-8.45-2.52-8.45-1.838 0-1.646 6.248-2.528 8.516-.038.097-.13.16-.234.16-.105 0-.198-.063-.235-.162-.568-1.485-.644-4.514-2.722-4.514h-1.627c-.284 0-.514.23-.514.514 0 .269.217.486.486.486h1.433c.579 0 .809.127 1.025.567.735 1.501.844 4.433 2.12 4.433 1.861 0 1.705-6.136 2.539-8.47.08-.223.395-.223.474 0 .875 2.476.798 8.47 2.55 8.47 1.703 0 1.66-5.985 2.511-8.417.079-.226.399-.224.477.003.85 2.534.804 8.414 2.512 8.414 1.852 0 1.752-5.955 2.503-8.45.068-.226.386-.242.474-.021.576 1.412.874 4.468 2.476 4.468h1.907c.283 0 .514-.23.514-.514 0-.259-.21-.47-.47-.47h-1.777z" />
            </svg>
          </button>

          {/* rectangle */}
          <button className="annontation-tool" id="area" onClick={handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="icon bi bi-square"
              viewBox="0 0 20 20"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            </svg>
          </button>

          {/* text */}
          <button
            className="annontation-tool"
            id="textbox"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="icon bi bi-textarea-t"
              viewBox="0 0 20 20"
            >
              <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874V2.5zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v3.563zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386L11.434 4z" />
            </svg>
          </button>

          {/* eraser */}
          <button
            className="annontation-tool"
            id="eraser"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="icon bi bi-eraser"
              viewBox="0 0 20 20"
            >
              <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
            </svg>
          </button>
        </div>
    </div>
  );
};

export default ViewPDF;

// function createSvg(page, i) {
//   const svg = document.createElement("svg");

//   svg.setAttribute("class", "annotationLayer");

//   svg.style.width = page.style.width;
//   svg.style.height = page.style.height;

//   svg.setAttribute("data-pdf-annotate-viewport", JSON.stringify(viewport));
//   svg.setAttribute("data-pdf-annotate-page", i + 1);
//   svg.setAttribute("data-pdf-annotate-container", true);
//   svg.setAttribute("data-pdf-annotate-document", "example.pdf");

//   const textLayer = page.querySelector(".textLayer");

//   page.insertBefore(svg, textLayer);
// }

// const history = useHistory();

// const { searchString, apiLoading, currentDocumentoffsetArray, pdfViewer, pdfFindController, currentPageNumber, numPages } = useSelector((state) => state.sharePDF);
// const dispatch = useDispatch();

// useEffect(() => {
//   document.querySelector("body").style.overflow = "hidden";
//   return () => {
//     document.querySelector("body").style.overflow = "visible";
//   };
// }, []);
// const query = new URLSearchParams(history.location.search);

// useEffect(() => {
//   document.onkeydown = function (evt) {
//     evt = evt || window.event;
//     // console.log(evt.key)

//     if (evt.key === "Escape" || evt.key === "Esc") {
//       // dispatch(clearPdfViewer({}))
//       // if(pdfViewer) {pdfViewer._resetView()}
//       if(history.location.pathname === '/search/sentences') {
//         history.push("/search");
//       }
//       else if (query.get("from") === "sent-window") {
//         history.push(localStorage.getItem("tc_url"));
//       } else {
//         history.push("/search");
//       }
//     }
//   };
// }, []);

// const highlight = () => {
//   // console.log("offsetArrayTinkered", offsetArrayTinkered)
//   setTimeout(() => {
//     if (pdfFindController) {
//       pdfFindController.executeCommand("find", { query: "" }); // to reset all  highlighted divs
//       pdfFindController.executeCommand("find", {
//         query: "`",
//         offsetArrayTinkered: currentDocumentoffsetArray,
//       });
//     }
//   }, 500);
// };

// const changePageOnLeftAndRightArrowKey = (e) => {
//   var pdfOuterElement = document.getElementById("pdfOuterPageId");
//   var key = e.key;
//   var modalHeight = window.innerHeight - 70;
//   var totalScrollHeight = pdfOuterElement.scrollHeight;
//   var currentScrollHeightFromTop = pdfOuterElement.scrollTop;

//   if (totalScrollHeight - currentScrollHeightFromTop - 10 <= modalHeight) {
//     if (key == "ArrowDown" && currentPageNumber !== numPages) {
//       dispatch(onChangePageSlice({ newPageNum: Number(currentPageNumber) + 1 }));
//       // highlight()
//     }
//   }
//   if (currentScrollHeightFromTop <= 5) {
//     if (key == "ArrowUp" && currentPageNumber !== 1) {
//       dispatch(onChangePageSlice({ newPageNum: Number(currentPageNumber) - 1 }));
//       // highlight()
//     }
//   }
//   var sideBarWidth = document.getElementsByClassName("hoverCard") ? document.getElementsByClassName("hoverCard")[0].offsetWidth : 0;

//   var modalWidth = window.innerWidth - sideBarWidth - 70;
//   var totalScrollWidth = pdfOuterElement.scrollWidth;
//   var currentScrollWidthFromLeft = pdfOuterElement.scrollLeft;

//   if (currentScrollWidthFromLeft <= 5) {
//     if (key == "ArrowLeft" && currentPageNumber !== 1) {
//       dispatch(onChangePageSlice({ newPageNum: Number(currentPageNumber) - 1 }));
//       // highlight()
//     }
//   }

//   if (totalScrollWidth - currentScrollWidthFromLeft - 10 <= modalWidth) {
//     if (key == "ArrowRight" && currentPageNumber !== numPages) {
//       dispatch(onChangePageSlice({ newPageNum: Number(currentPageNumber) + 1 }));
//       // highlight()
//     }
//   }
// };

// var params = new URLSearchParams(useLocation().search);

// useEffect(() => {
//   var payload = {
//     Url: params.get("pdf"),
//     query: params.get("query"),
//   };

//   var apiUrl = process.env.REACT_APP_Environment === "development" ? 'https://finsight.ai/api/view2/' : "/api/view2/"; // 'https://finsight.ai/api/view2/' 'http://localhost:5000/api/view2/'
//   startLoadingAPI();

//   axios
//     .post(apiUrl, payload)
//     .then((res) => {
//       // console.log({ res });
//       var { urlTemp, pageNumberArrayTemp, highlightedTextArrayTemp, currentDocumentoffsetArrayTemp, pdfNameTemp } = res.data;
//       var queryTemp = params.get("query");

//       // var currentPageNumberTemp =  params.get("page") && parseInt(params.get("page")) !== 1 ? parseInt(params.get("page")) : 1;
//       // tackled cases if someone share a particular page, or user open through notification,(first highlighted page should open)
//       if (params.get("page") && parseInt(params.get("page")) && parseInt(params.get("page")) === 1) {
//         var currentPageNumberTemp = pageNumberArrayTemp && pageNumberArrayTemp.length > 0 ? pageNumberArrayTemp[0] : 1;
//       } else if (params.get("page") && parseInt(params.get("page")) && parseInt(params.get("page")) !== 1) {
//         var currentPageNumberTemp = parseInt(params.get("page"));
//       } else {
//         var currentPageNumberTemp = 1;
//       }
//       // console.log({urlTemp, queryTemp, currentPageNumberTemp, pageNumberArrayTemp, highlightedTextArrayTemp, currentDocumentoffsetArrayTemp})
//       dispatch(setUrlAndQueryString({ urlTemp, queryTemp, currentPageNumberTemp, pageNumberArrayTemp, highlightedTextArrayTemp, currentDocumentoffsetArrayTemp, pdfNameTemp }));
//     })
//     .catch(() => {
//       var urlTemp = null,
//         queryTemp = null,
//         currentPageNumberTemp = null,
//         pageNumberArrayTemp = null,
//         highlightedTextArrayTemp = null,
//         currentDocumentoffsetArrayTemp = null,
//         pdfNameTemp = "Sample.pdf";
//       dispatch(setUrlAndQueryString({ urlTemp, queryTemp, currentPageNumberTemp, pageNumberArrayTemp, highlightedTextArrayTemp, currentDocumentoffsetArrayTemp, pdfNameTemp }));
//     });
// }, []);
