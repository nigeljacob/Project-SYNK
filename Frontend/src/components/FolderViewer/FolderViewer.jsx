import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import axios from "axios";
import download from "downloadjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import * as IOIcons from "react-icons/io";
import Box from "@mui/material/Box";
import "./FolderViewer.css";
import { FaDownload } from "react-icons/fa6";
import { sendNotification } from "../../utils/teamFunctions";
import { auth } from "../../utils/firebase";

function FolderViewer({ url, filePath, title }) {
  const [folderStructure, setFolderStructure] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (downloaded) {
      sendNotification(
        "Download Succssfull",
        "The zip file has been downloaded. Please navigate to the relavent directory to access the file",
        "success",
        "success",
        auth.currentUser.uid
      );
    }
  }, []);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        // Fetch the zip file from the URL
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const zip = await JSZip.loadAsync(response.data);

        const zipFileName =
          filePath.split("/")[filePath.split("/").length - 1] + " - " + title;
        const folderStructure = { id: "root", name: zipFileName, children: [] };

        // Iterate over each file in the zip
        Object.keys(zip.files).forEach(async (filename) => {
          const parts = filename.split("/");
          let currentFolder = folderStructure;

          // Iterate over each part to build the folder structure
          parts.forEach((part) => {
            if (part === "") {
              return; // Skip empty parts
            }

            // Check if the current part already exists as a child
            let childFolder = currentFolder.children.find(
              (folder) => folder.name === part
            );
            if (!childFolder) {
              // Create a new child folder if it doesn't exist
              childFolder = {
                id: `${currentFolder.id}-${part}`,
                name: part,
                children: [],
              };
              currentFolder.children.push(childFolder);
            }

            // Update current folder to the child folder for the next iteration
            currentFolder = childFolder;
          });

          // If it's the last part (i.e., the file), read its contents and add to the folder structure
          if (!zip.files[filename].dir) {
            let content;
            const extension = filename.split(".").pop().toLowerCase(); // Get file extension
            if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
              // If the file is an image, render it as an <img> element
              const blob = await zip.file(filename).async("blob");
              content = URL.createObjectURL(blob);
            }
            content = await zip.file(filename).async("string");
            currentFolder.content = content;
          }
        });

        setFolderStructure(folderStructure);
      } catch (error) {
        console.error("Error fetching or extracting zip file:", error);
      }
    };

    fetchFolderData();
  }, [url]);

  const handleFileClick = (content, name) => {
    setSelectedFileContent(content);
    setSelectedFileName(name);
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      // onClick={() => handleFileClick(nodes.content, nodes.name)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <div style={{ display: "flex" }}>
      <div className="widthMain tw-mx-[10px]">
        {selectedFileContent ? (
          <div className="tw-mx-[10px]">
            <div className="tw-flex tw-flex-row tw-items-center tw-mb-[10px] tw-relative tw-w-full">
              <IOIcons.IoIosArrowBack
                className="tw-mr-[10px] tw-w-[20px] tw-h-[20px] tw-cursor-pointer"
                onClick={(event) => {
                  handleFileClick("", "");
                }}
              />
              <h3 className="tw-text-[14px]">{selectedFileName}</h3>
            </div>
            <div className="tw-bg-black tw-p-[10px] tw-text-white tw-rounded-[5px] tw-text-[12px] tw-select-text tw-font-mono heightMain4">
              {selectedFileName.endsWith(".jpg") ||
              selectedFileName.endsWith(".png") ||
              selectedFileName.endsWith(".jpeg") ? (
                <img
                  src={`data:image/png;base64,${selectedFileContent}`}
                  alt={selectedFileName}
                />
              ) : selectedFileName.endsWith(".pdf") ? (
                <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
                  <h3>
                    PDF Viewer is not supported. Download the file to view it
                  </h3>
                </div>
              ) : (
                <pre>{selectedFileContent}</pre>
              )}
            </div>
          </div>
        ) : (
          <div className="tw-p-[10px] tw-rounded-[10px] tw-overflow-y-scroll tw-text-[7px] heightMain">
            <Box sx={{ typography: "subtitle2", fontSize: 7 }}>
              <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultParentIcon={<FolderIcon />}
                defaultEndIcon={<InsertDriveFileIcon />}
                sx={{ typography: "subtitle2", fontSize: 7 }}
              >
                {renderTree(folderStructure)}
              </TreeView>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderViewer;
