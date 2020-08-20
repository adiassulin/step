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

const COUNTER_OBJ = {
    picturesIndex: 0
};
const ALL_PICTURES = ['20060919215839_DSC_6806.JPG', '20060919222117_DSC_6821.JPG', '20170204094939_IMG_1368.JPG'
, '20170209104355_IMG_1531.JPG', '20170213143558_IMG_1735.JPG', '20170222180214_IMG_1834.JPG', '20170302135232_IMG_2101.JPG',
'IMG_20170115_202802_153.jpg'];

const IMG_CONTAINER_ID = 'img-container';

const IMG_DIR_PATH = '/images/';

const HAKA_IFRAME_ID = 'hakaIframe';

const HAKA_VB_ID = 'hakaVideoButton';

const CSS_STYLE_VISIBLE = 'visible';

const CSS_STYLE_HIDDEN = 'hidden';

const DEF_LIMIT_URL = '/data?limit=15';

const PREF_LIMIT_URL = '/data?limit='

const COM_CONTAINER_ID = 'comments';

const QUAN_CONTAINER_ID = 'quantity';

const EMPTY = '';

const LIST_ITEM_ELEM = 'li';

const DEL_ERR_MSG = 'deletion failed';

const DEL_SERVLRT = '/delete-data';

const POST_REQ = 'POST';



/** 
* changes the picture in the dom gallery according to pictureIndex variable.
 */
function changePictureInDom()
{
    const pic = ALL_PICTURES[COUNTER_OBJ.picturesIndex];
    const imgContainer = document.getElementById(IMG_CONTAINER_ID);
    imgContainer.src = IMG_DIR_PATH + pic;
}

/** 
* moves the pictureIndex forward.
*/
function nextPicture()
{
    COUNTER_OBJ.picturesIndex++;
    COUNTER_OBJ.picturesIndex = COUNTER_OBJ.picturesIndex === ALL_PICTURES.length? 0 : COUNTER_OBJ.picturesIndex;   
    changePictureInDom();
}

/**
* moves the pictureIndex backwards.
*/
function previousPicture()
{
    COUNTER_OBJ.picturesIndex--;
    COUNTER_OBJ.picturesIndex = COUNTER_OBJ.picturesIndex < 0 ? ALL_PICTURES.length - 1 : COUNTER_OBJ.picturesIndex;   
    changePictureInDom();
}

/**
* displays the haka videwin the iframe.
 */
function displayHakaFrame()
{
    const hakaIframe = document.getElementById(HAKA_IFRAME_ID);
    hakaIframe.height = 345;
    hakaIframe.width = 420;
    hakaIframe.style.visibility = CSS_STYLE_VISIBLE;

    const hakaVideoButton = document.getElementById(HAKA_VB_ID);
    hakaVideoButton.style.visibility = CSS_STYLE_HIDDEN;
}

/**
* requests for the recommendations from db and displays it on the dom.
 */
function getComments(url)
{
    //default limit is 15
    if (url === undefined) url = DEF_LIMIT_URL;
    fetch(url).then((response) => response.json()).then((comments) => {
        const commentsElement = document.getElementById(COM_CONTAINER_ID);

        //clear previus comments
        commentsElement.innerHTML = EMPTY;

        comments.forEach(comment=> {
            const com = document.createElement(LIST_ITEM_ELEM);
            com.textContent = comment;
            commentsElement.appendChild(com);
        });
    }).catch((error) => {
        consol.log(error);
        window.alert(DEL_ERR_MSG);
    });
}

/**
* changes the amout of comments display in the DOM addording to a user input.
 */
function changeCommentsLimit()
{
    const limit = document.getElementById(QUAN_CONTAINER_ID).value;
    const url = PREF_LIMIT_URL + limit;
    console.log(url);
    getComments(url);
}

/**
* deletes all comments using post reruest.
 */
function deleteComments()
{
    const request = new Request(DEL_SERVLRT, {method: POST_REQ});
    fetch(request).then(() => getComments()).catch((error) => {
        console.log(error);
        window.alert(DEL_ERR_MSG);
    });
}