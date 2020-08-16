// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['i like pizza', 'i have 3 siblings', 'i live in jerusalem', 'my fav color is pink'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/**
*show the next picture on the screen
 */
 //ask for static variable because we heard that globalis not good
const counterObj = {
    picturesIndex: 0
}
const allPictures = ['20060919215839_DSC_6806.JPG', '20060919222117_DSC_6821.JPG', '20170204094939_IMG_1368.JPG'
, '20170209104355_IMG_1531.JPG', '20170213143558_IMG_1735.JPG', '20170222180214_IMG_1834.JPG', '20170302135232_IMG_2101.JPG',
'IMG_20170115_202802_153.jpg'];

/** 
* change the picture in the dom gallery according to pictureIndex variable
 */
function changePictureInDom()
{
    const pic = allPictures[counterObj.picturesIndex];
    const imgContainer = document.getElementById('img-container');
    imgContainer.src = '/images/' + pic;
}

/** 
moves the pictureIndex forward
 */
function nextPicture()
{
    counterObj.picturesIndex++;
    counterObj.picturesIndex = counterObj.picturesIndex === allPictures.length? 0 : counterObj.picturesIndex;   
    changePictureInDom();
}

/**
* moves the pictureIndex backwards
 */
function previousPicture()
{
    counterObj.picturesIndex--;
    counterObj.picturesIndex = counterObj.picturesIndex < 0 ? allPictures.length - 1 : counterObj.picturesIndex;   
    changePictureInDom();
}

/**
* displays the haka videwin the iframe
 */
function displayHakaFrame()
{
    const hakaIframe = document.getElementById('hakaIframe');
    hakaIframe.height = 345;
    hakaIframe.width = 420;
    hakaIframe.style.visibility = 'visible';

    const hakaVideoButton = document.getElementById('hakaVideoButton')
    hakaVideoButton.style.visibility = 'hidden';
}



//week 3 -server try
function randomTrack()
{
    fetch('/data').then(response => response.text()).then((text)=> {
        document.getElementById('randomTrack').textContent = text;
    });
}

function showTracks()
{
    fetch('/data').then(response => response.json()).then(tracks => 
    {
        console.log(tracks);
        document.getElementById('randomTrack').textContent = tracks;

    })
}