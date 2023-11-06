import "./App.css";
import { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import React, { ChangeEvent } from 'react';
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";

import images from "./api/image.json";

// Constants
const MOBILE_BREAKPOINT = 768;
const INITIAL_BOXES_PER_ROW = window.innerWidth <= MOBILE_BREAKPOINT ? 2 : 5;

// Define the 'Image' interface to describe the structure of image objects
interface Image {
  id: number;
  image: string;
  checked: boolean;
}

export default function App() {
  // State to manage the list of image items
  const [items, setItems] = useState<Image[]>(
    images.map((singleImage) => ({ ...singleImage, checked: false }))
  );

  // State to manage the selected image IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // State to manage the number of boxes per row based on the screen width
  const [boxesPerRow, setBoxesPerRow] = useState(INITIAL_BOXES_PER_ROW);

  // Function to handle the reordering of items when dragged
  function onChange(sourceId: string, sourceIndex: number, targetIndex: number) {
    const nextState = swap(items, sourceIndex, targetIndex);
    setItems(nextState);
  }

  // Effect to handle resizing the number of boxes per row when the window size changes
  useEffect(() => {
    const handleResize = () => {
      const newBoxesPerRow = window.innerWidth <= MOBILE_BREAKPOINT ? 2 : 5;
      if (newBoxesPerRow !== boxesPerRow) {
        setBoxesPerRow(newBoxesPerRow);
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener to avoid memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [boxesPerRow]);

  // Function to handle the change of the checkbox for an image
  const handleCheckboxChange = (id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, checked: event.target.checked };
      }
      return item;
    });
    setItems(updatedItems);

    if (event.target.checked) {
      // Checkbox is checked, add the ID to the selectedIds array
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      // Checkbox is unchecked, remove the ID from the selectedIds array
      setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  // Function to handle deleting selected files
  const handleDeleteFile = () => {
    const filteredItems = items.filter((item) => !selectedIds.includes(item.id));
    setItems(filteredItems);
    setSelectedIds([]);
  };

  console.log(selectedIds);

  return (
    <Box className="App">
      <div className="nav">
        <div className="hori">
          {selectedIds.length >= 1 ? (
            // Display when one or more images are selected
            <div className="display">
              <h3>
                <input type="checkbox" checked />
                {selectedIds.length} images selected
              </h3>
              <b className="delete" onClick={handleDeleteFile}>
                Delete Files
              </b>
            </div>
          ) : (
            // Display when no images are selected
            <h3>Gallery</h3>
          )}
        </div>
      </div>

      <GridContextProvider onChange={onChange}>
        <GridDropZone
          className="margin"
          id="items"
          boxesPerRow={boxesPerRow}
          rowHeight={267}
          style={{ height: 280 * Math.ceil(items.length / boxesPerRow) }}
        >
          {items.map(({ id, image, checked }, index) => (
            <GridItem key={id}>
              <Card
                sx={{ marginRight: index === 0 ? 2 : 2, marginBottom: 2 }}
                className={`border ${checked ? 'marked' : ''}`}
              >
                <input
                  className={`j border ${checked ? 'marked j2' : ''}`}
                  type="checkbox"
                  checked={checked}
                  onChange={handleCheckboxChange(id)}
                  name=""
                  id={id.toString()}
                />
                <CardMedia
                  component="img"
                  width="100%"
                  height={index === 0 ? "260px" : "170px"}
                  style={{
                    backgroundSize: "cover",
                    backgroundImage: `url(${image})`,
                  }}
                />
              </Card>
            </GridItem>
         ) )}
        </GridDropZone>
      </GridContextProvider>
    </Box>
  );
}
