import React, { useEffect, useRef, useState } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneMath from "cornerstone-math";
import "hammerjs";
import CVport from "react-cornerstone-viewport";

export default function DicomViewer() {
  const [tools, setTools] = useState([
    {
      name: "FreehandRoi",
      mode: "active",
      modeOptions: { mouseButtonMask: 1 },
    },
    { name: "StackScrollMouseWheel", mode: "active" },
    // { 
    //   name: "Length",
    //   mode: "active",
    //   modeOptions: { mouseButtonMask: 2 },
    // },
  ]);
  const cornerstoneElementRef = useRef(null);
  // let imageIds = [
  //   "https://rawgit.com/dannyrb/cornerstone-vuejs-poc/master/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.10.jpg",
  // ];

  const imageIds = [
    "dicomweb://raw.githubusercontent.com/Anush-DP/gdcmdata/master/MR-SIEMENS-DICOM-WithOverlays.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ];

  const addTool = (newTool) => {
    setTools((prevTools) => [...prevTools, newTool]);
  };

  useEffect(() => {
    console.log(tools === [
      {
        name: "FreehandRoi",
        mode: "active",
        modeOptions: { mouseButtonMask: 1 },
      },
      { name: "StackScrollMouseWheel", mode: "active" },
      { 
        name: "Length",
        mode: "active",
        modeOptions: { mouseButtonMask: 2 },
      },
    ]);
    console.log(tools)
  }, [tools]);

  return (
    <>
      <button
        onClick={() => {
          const newTool = {
            name: "Length",
            mode: "active",
            modeOptions: { mouseButtonMask: 2 },
          };
          addTool(newTool);
        }}
      >
        Add New Tool
      </button>
      <CVport
        imageIds={imageIds}
        tools={tools}
        style={{ minWidth: "100%", height: "512px", flex: "1" }}
      />
      {/* <button
        onClick={setTest(true)}
      >

      </button> */}
    </>
  );
}
