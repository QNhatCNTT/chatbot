require('dotenv').config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = 'http://bit.ly/abcstudyonline';
const IMAGE_WEB_JS = 'http://bit.ly/bot_javascript';
const IMAGE_WEB_REACTJS = 'http://bit.ly/bot_reactjs';
const IMAGE_WEB_NODEJS = 'http://bit.ly/bot_nodejs';
/* const IMAGE_WEB_PHP = 'http://bit.ly/bot-php';
const IMAGE_WEB_VUEJS = 'http://bit.ly/bot_vuejs';
const IMAGE_WEB_ANGULAR = 'http://bit.ly/bot_angular'; */

const IMAGE_MOBILE_ANDROID = 'http://bit.ly/bot_android';
const IMAGE_MOBILE_REACTNATIVE = 'http://bit.ly/bot_reactnative';
const IMAGE_MOBILE_IOS = 'http://bit.ly/bot-ios-1';
/* const IMAGE_MOBILE_FLUTTER = 'http://bit.ly/bot_flutter';
const IMAGE_MOBILE_KOTLIN = 'http://bit.ly/bot_kotlin';
const IMAGE_MOBILE_SWIFT = 'http://bit.ly/bot_swift'; */


let callSendAPI = async (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            }

            // Send the HTTP request to the Messenger Platform
            await sendTypingon(sender_psid);
            await MarkMessage(sender_psid);

            request({
                "uri": "https://graph.facebook.com/v10.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(body);
                console.log(res)
                if (!err) {
                    resolve('message sent!')
                } else {
                    console.error("Unable to send message:" + err);
                }
            });

        } catch (e) {
            reject(e);
        }
    })


}

let sendTypingon = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingon sent!')
        } else {
            console.error("Unable to send sendTypingon:" + err);
        }
    });
}

let MarkMessage = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingon sent!')
        } else {
            console.error("Unable to send sendTypingon:" + err);
        }
    });
}

let getUserName = (sender_psid) => {

    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                let username = `${body.last_name} ${body.first_name} `;
                resolve(username);
            } else {
                console.error("Unable to send message:" + err);
                reject(err);
            }
        });
    })
}

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = { "text": `Xin ch??o m???ng ${username} ?????n v???i ABC Study Online` }

            let response2 = getStartedTemplate();
            //send text message
            await callSendAPI(sender_psid, response1);

            //send generic template message
            await callSendAPI(sender_psid, response2);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "ABC STUDY ONLINE",
                    "subtitle": "D?????i ????y l?? c??c option",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "T??m ki???m",
                            "payload": "COURSE_SEARCH",
                        },
                        {
                            "type": "postback",
                            "title": "Menu Kh??a H???c",
                            "payload": "COURSE_CATALOG",
                        }
                    ],
                }]
            }
        }
    };
    return response;
}

let handleSendCatalog = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getMainMenuTemplate();
            await callSendAPI(sender_psid, response1);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getMainMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "CATALOG SOURSE",
                    "subtitle": "Danh m???c kh??a h???c t???i ABC Study Online",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Learn Web",
                            "payload": "LEARN_WEB",
                        },
                        {
                            "type": "postback",
                            "title": "Learn Mobile",
                            "payload": "LEARN_MOBILE",
                        },

                    ],
                },
                {
                    "title": "WEBSITE",
                    "subtitle": "Vui l??ng truy c???p ?????n website ????? bi???t th??m nhi???u th??ng tin v?? ??u ????i",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Website",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_MAIN",
                        }

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleSendCatWeb = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getCatWeb();
            await callSendAPI(sender_psid, response1);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getCatWeb = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Javascript",
                    "subtitle": "C??c b??i gi???ng v??? Javascript",
                    "image_url": IMAGE_WEB_JS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_JAVASCRIPT",
                        },

                    ],
                },
                {
                    "title": "ReactJS",
                    "subtitle": "C??c b??i gi???ng v??? ReactJS",
                    "image_url": IMAGE_WEB_REACTJS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_REACTJS",
                        },

                    ],
                },
                {
                    "title": "NodeJS",
                    "subtitle": "C??c b??i gi???ng v??? NodeJS",
                    "image_url": IMAGE_WEB_NODEJS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_NODEJS",
                        },

                    ],
                },
                /* {
                    "title": "PHP",
                    "subtitle": "C??c b??i gi???ng v??? PHP",
                    "image_url": IMAGE_WEB_PHP,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_PHP",
                        },

                    ],
                },
                {
                    "title": "VueJS",
                    "subtitle": "C??c b??i gi???ng v??? VueJS",
                    "image_url": IMAGE_WEB_VUEJS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_VUEJS",
                        },

                    ],
                },
                {
                    "title": "Angular",
                    "subtitle": "C??c b??i gi???ng v??? Angular",
                    "image_url": IMAGE_WEB_ANGULAR,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_ANGULAR",
                        },

                    ],
                }, */
                {
                    "title": "Other",
                    "subtitle": "",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Truy c???p web",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_CATALOG",
                        }

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleSendCatMobile = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getCatMobile();
            await callSendAPI(sender_psid, response1);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getCatMobile = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Android",
                    "subtitle": "C??c b??i gi???ng v??? Android",
                    "image_url": IMAGE_MOBILE_ANDROID,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_ANDROID",
                        },

                    ],
                },
                {
                    "title": "React Native",
                    "subtitle": "C??c b??i gi???ng v??? React Native",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_REACT_NATIVE",
                        },

                    ],
                },
                {
                    "title": "IOS",
                    "subtitle": "C??c b??i gi???ng v??? IOS",
                    "image_url": IMAGE_MOBILE_IOS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_IOS",
                        },

                    ],
                },
                /* {
                    "title": "Flutter",
                    "subtitle": "C??c b??i gi???ng v??? Flutter",
                    "image_url": IMAGE_MOBILE_FLUTTER,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_FLUTTER",
                        },

                    ],
                },
                {
                    "title": "Kotlin",
                    "subtitle": "C??c b??i gi???ng v??? Kotlin",
                    "image_url": IMAGE_MOBILE_KOTLIN,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_KOTLIN",
                        },

                    ],
                },
                {
                    "title": "Swift",
                    "subtitle": "C??c b??i gi???ng v??? Swift",
                    "image_url": IMAGE_MOBILE_SWIFT,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi ti???t",
                            "payload": "VIEW_SWIFT",
                        },

                    ],
                }, */
                {
                    "title": "Other",
                    "subtitle": "",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Truy c???p web",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_CATALOG",
                        }

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleBackCatalog = async (sender_psid) => {
    await handleSendCatalog(sender_psid);
}

let handleBackMain = async (sender_psid) => {
    let response2 = getStartedTemplate();
    await callSendAPI(sender_psid, response2);
}
let handleBackWeb = async (sender_psid) => {
    await handleSendCatWeb(sender_psid);
}

let handleBackMobile = async (sender_psid) => {
    await handleSendCatMobile(sender_psid);
}

let handleDetailJavascript = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailJavascript();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailJavascript = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup m??i tr?????ng v?? c??i ?????t",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Kh??i ni???m 1 v?? th???c h??nh 1",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Kh??i ni???m 2 v?? th???c h??nh 2",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Kh??i ni???m 3 v?? th???c h??nh 3",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Kh??i ni???m 4 v?? th???c h??nh 4",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Kh??i ni???m 5 v?? th???c h??nh 5",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "????ng k??",
                    "subtitle": "Gi??: 1.500.000VND",
                    "image_url": IMAGE_WEB_JS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "????ng K??",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailReactJS = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailReactJS();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailReactJS = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup m??i tr?????ng v?? c??i ?????t",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Kh??i ni???m 1 v?? th???c h??nh 1",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Kh??i ni???m 2 v?? th???c h??nh 2",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Kh??i ni???m 3 v?? th???c h??nh 3",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Kh??i ni???m 4 v?? th???c h??nh 4",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Kh??i ni???m 5 v?? th???c h??nh 5",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "????ng k??",
                    "subtitle": "Gi??: 3.500.000VND",
                    "image_url": IMAGE_WEB_REACTJS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "????ng K??",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailNodeJS = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailNodeJS();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailNodeJS = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup m??i tr?????ng v?? c??i ?????t",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Kh??i ni???m 1 v?? th???c h??nh 1",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Kh??i ni???m 2 v?? th???c h??nh 2",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Kh??i ni???m 3 v?? th???c h??nh 3",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Kh??i ni???m 4 v?? th???c h??nh 4",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Kh??i ni???m 5 v?? th???c h??nh 5",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "????ng k??",
                    "subtitle": "Gi??: 4.000.000VND",
                    "image_url": IMAGE_WEB_NODEJS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "????ng K??",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailAndroid = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailAndroid();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailAndroid = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup m??i tr?????ng v?? c??i ?????t",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Kh??i ni???m 1 v?? th???c h??nh 1",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Kh??i ni???m 2 v?? th???c h??nh 2",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Kh??i ni???m 3 v?? th???c h??nh 3",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Kh??i ni???m 4 v?? th???c h??nh 4",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Kh??i ni???m 5 v?? th???c h??nh 5",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "????ng k??",
                    "subtitle": "Gi??: 2.000.000VND",
                    "image_url": IMAGE_MOBILE_ANDROID,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "????ng K??",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailReactNative = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailReactNative();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailReactNative = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup m??i tr?????ng v?? c??i ?????t",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Kh??i ni???m 1 v?? th???c h??nh 1",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Kh??i ni???m 2 v?? th???c h??nh 2",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Kh??i ni???m 3 v?? th???c h??nh 3",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Kh??i ni???m 4 v?? th???c h??nh 4",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Kh??i ni???m 5 v?? th???c h??nh 5",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "????ng k??",
                    "subtitle": "Gi??: 2.000.000VND",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "????ng K??",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailIOS = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailIOS();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailIOS = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup m??i tr?????ng v?? c??i ?????t",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Kh??i ni???m 1 v?? th???c h??nh 1",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Kh??i ni???m 2 v?? th???c h??nh 2",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Kh??i ni???m 3 v?? th???c h??nh 3",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Kh??i ni???m 4 v?? th???c h??nh 4",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Kh??i ni???m 5 v?? th???c h??nh 5",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "????ng k??",
                    "subtitle": "Gi??: 2.000.000VND",
                    "image_url": IMAGE_MOBILE_IOS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "????ng K??",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Tr??? v???",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendCatalog: handleSendCatalog,
    handleSendCatWeb: handleSendCatWeb,
    handleSendCatMobile: handleSendCatMobile,
    handleBackCatalog: handleBackCatalog,
    handleBackMain: handleBackMain,
    handleDetailJavascript: handleDetailJavascript,
    handleBackWeb: handleBackWeb,
    handleBackMobile: handleBackMobile,
    handleDetailReactJS: handleDetailReactJS,
    handleDetailNodeJS: handleDetailNodeJS,
    handleDetailAndroid: handleDetailAndroid,
    handleDetailReactNative: handleDetailReactNative,
    handleDetailIOS: handleDetailIOS,
}