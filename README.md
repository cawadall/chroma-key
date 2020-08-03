Chroma Key Effect
---

This application approximates a chroma key effect using either the video stream captured in real time of the local camera or a local video file. It allows the user to set limit RGB values for the input video stream and overlay the part of the input frame that goes over the filter into a selected image, creating a new scene using Web Technologies (HTML + CSS + JS + WebRTC).


### USAGE

#### Execution:
Double click over the HTML file.

#### Setting Up:
If the program finds an available video source on the user's computer it will automatically set it as the default video source. In case of no video source found, the user must select a local video file in the FS using the left-side part of the application, using the 'Browse' button. Once selected, use the radio input below to selec the image in which to overlap the video to create the chroma key effect.
Finally, adjust the sliders of the minimum and maximum values for each color component according to the RGB color space. Changes on the final result will automatically be computed and shown on the right-side output images.
