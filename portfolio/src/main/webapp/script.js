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

const ALL_PICS = ['20060919215839_DSC_6806.JPG', '20060919222117_DSC_6821.JPG', '20170204094939_IMG_1368.JPG'
, '20170209104355_IMG_1531.JPG', '20170213143558_IMG_1735.JPG', '20170222180214_IMG_1834.JPG', '20170302135232_IMG_2101.JPG',
'IMG_20170115_202802_153.jpg'];

const IMG_CONTAINER = 'img-container';

const IMG_PATH = '/images/';

const HAKA_IFRAME = 'hakaIframe';

const STYLE_VISIBLE = 'visible';

const STYLE_HIDDEN = 'hidden';

const HAKA_VIDEO_BTN_ID = 'hakaVideoButton';

const COMMENTS_ELEM_ID = 'comments';

const QUANTITY_ELEM_ID = 'quantity';

const DEF_URL_LIMIT = '/data?limit=15';

const PREF_URL_LIMIT = '/data?limit=';

const EMPTY_STR = '';

const LI_ELEM = 'li';

const DELET_FAIL_MSG = 'deletion failed';

const DELETE_DATA_SERVLET = '/delete-data';

const POSR_REQUEST = 'POST';

const GREEN = '#008000';

const LIME_GREEN = '#32CD32';

const LIGHTGREEN = '#90EE90';

const LIGHTRED = '#CD5C5C';

const RED = '#FF0000';



/** 
* changes the picture in the dom gallery according to pictureIndex variable.
*/
function changePictureInDom()
{
    const pic = ALL_PICS[COUNTER_OBJ.picturesIndex];
    const imgContainer = document.getElementById(IMG_CONTAINER);
    imgContainer.src = IMG_PATH + pic;
}

/** 
* moves the pictureIndex forward.
*/
function nextPicture()
{
    COUNTER_OBJ.picturesIndex++;
    COUNTER_OBJ.picturesIndex = COUNTER_OBJ.picturesIndex === ALL_PICS.length? 0 : COUNTER_OBJ.picturesIndex;   
    changePictureInDom();
}

/**
* moves the pictureIndex backwards.
*/
function previousPicture()
{
    COUNTER_OBJ.picturesIndex--;
    COUNTER_OBJ.picturesIndex = COUNTER_OBJ.picturesIndex < 0 ? ALL_PICS.length - 1 : COUNTER_OBJ.picturesIndex;   
    changePictureInDom();
}

/**
* displays the haka videwin the iframe.
 */
function displayHakaFrame()
{
    const hakaIframe = document.getElementById(HAKA_IFRAME);
    hakaIframe.height = 345;
    hakaIframe.width = 420;
    hakaIframe.style.visibility = STYLE_VISIBLE;

    const hakaVideoButton = document.getElementById(HAKA_VIDEO_BTN_ID)
    hakaVideoButton.style.visibility = STYLE_HIDDEN;
}

/**
* requests for the recommendations from db and display it on the dom.
 */
function getComments(url)
{
    //default limit is 15
    if (url === undefined) url = DEF_URL_LIMIT;
    fetch(url).then((response) => response.json()).then((comments) => {
        const commentsElement = document.getElementById(COMMENTS_ELEM_ID);

        //clear previus comments
        commentsElement.innerHTML = EMPTY_STR;

        Object.keys(comments).forEach((comment) => {
            const score = comments[comment].toFixed(3);
            const com = document.createElement(LI_ELEM);
            const backColor = commentBackground(score);
            com.style.backgroundColor = backColor;
            com.innerHTML = comment;
            commentsElement.appendChild(com);
        });
    }).catch((error) => {
        console.log(error);
        window.alert(DELET_FAIL_MSG);
    });
}

/**
* returns the comment background color according to the given comment score.
 */
function commentBackground(score)
{
    if (score > 0.66) return GREEN;
    if (score <= 0.66 && score > 0.33) return LIME_GREEN;
    if (score <= 0.33 && score >= 0) return LIGHTGREEN;
    if (score < 0 && score >= -0.5) return LIGHTRED;
    else return RED;
}

/**
* changes the amout of comments display in the DOM addording to a user input.
 */
function changeCommentsLimit()
{
    const limit = document.getElementById(QUANTITY_ELEM_ID).value;
    const url = PREF_URL_LIMIT + limit;
    console.log(url);
    getComments(url);  
}

/**
* deletes all comments using post reruest.
 */
function deleteComments()
{
    const request = new Request(DELETE_DATA_SERVLET, {method: POSR_REQUEST});
    fetch(request).then(() => getComments()).catch((error) => {
        console.log(error);
        window.alert(DELET_FAIL_MSG);
    });
}