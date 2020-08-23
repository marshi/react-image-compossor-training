// @flow
import * as React from 'react';
import {ChangeEvent, ChangeEventHandler, FormEvent, useState} from "react";
import {Card} from "react-bootstrap";
import imageCompression from "browser-image-compression";

type Props = {
  compressedLink: string,
  originalImage: File | null,
  originalLink: string,
  outputFileName: string | undefined,
  clicked: boolean,
  uploadImage: boolean
};


export const ImageCompressor = () => {
  const init: Props = {
    compressedLink: "http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png",
    originalImage: null,
    originalLink: "",
    clicked: false,
    uploadImage: false,
    outputFileName: ""
  }
  const [state, setState] = useState(init)

  function handle(e: ChangeEvent<HTMLInputElement>) {
    const imageFile = e.target.files?.[0]
    console.log(state)
    setState({
      ...state,
      originalLink: URL.createObjectURL(imageFile),
      originalImage: imageFile || null,
      outputFileName: imageFile?.name,
      uploadImage: true
    })
  }

  function click(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true
    }

    let size = state.originalImage?.size || 0;
    if (options.maxSizeMB >= size / 1024) {
      return 0
    }
    let output
    imageCompression(state.originalImage!, options).then(x => {
      output = x
      const downloadLink = URL.createObjectURL(output)
      setState({
        ...state,
        compressedLink: downloadLink
      })
    })
    setState({...state, clicked: true})
    return 0
  }

  return (
    <div className="m-5">
      <div className="row mt-5">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          {state.uploadImage ? (
            <Card.Img
              className="ht"
              variant="top"
              src={state.originalLink}
            />
          ) : (
            <Card.Img
              className="ht"
              variant="top"
              src="http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              className="mt-2 btn btn-dark w-75"
              onChange={e => handle(e)}/>
          </div>
        </div>
        <div>
          <br/>
          {state.outputFileName ? (
            <button
              type={"button"}
              onClick={e => click(e)}
              className={" btn btn-dark"}>
              Compress
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
          <Card.Img variant="top" src={state.compressedLink}/>
          {state.clicked ? (
            <div className="d-flex justify-content-center">
              <a
                href={state.compressedLink}
                download={state.outputFileName}
                className="mt-2 btn btn-dark w-75"
              >
                Download
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
