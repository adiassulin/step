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

const counterObj = {
    picturesIndex: 0
};
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
* moves the pictureIndex forward
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

/**
* requests for the recommendations from db and display it on the dom
 */
function getComments(url)
{
    //default limit is 15
    if (url === undefined) url = "/data?limit=15";
    fetch(url).then(response => response.json()).then(comments => {
        let commentsElement = document.getElementById('comments')

        //clear previus comments
        commentsElement.innerHTML = '';

        comments.forEach(comment=> {
            let com = document.createElement('li');
            com.textContent = comment;
            commentsElement.appendChild(com);
        });
    }).catch((error) => {
        consol.log(error);
        window.alert('deletion failed');
    });
}

/**
* change the amout of comments display in the DOM addording to a user input
 */
function changeCommentsLimit()
{
    let limit = document.getElementById('quantity').value;
    let url = '/data?limit=' + limit;
    console.log(url);
    getComments(url);
    
}

/**
* deletes all comments using post reruest
 */
function deleteComments()
{
    const request = new Request('/delete-data', {method: 'POST'});
    fetch(request).then(() => getComments()).catch((error) => {
        console.log(error);
        window.alert('deletion failed');
    });
}