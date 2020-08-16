import firebase from './Firebase.js'

class Fire {    
    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    // getRoom(room) {
    //     return firebase.database().ref(`messages/${room}`);
    // }

    // get first_name() {
    //     return (firebase.auth().currentUser || {}).displayName.split("@")[0];
    // }

    // get last_name() {
    //     return (firebase.auth().currentUser || {}).displayName.split("@")[1];
    // }

    // async picture(uid) {
    //     return (await firebase.database().ref(`users/${uid}/image`).once('value')).val()
    // }

    // send = (messages, room) => {
    //     messages.forEach(item => {
    //         const message = {
    //             text: item.text,
    //             timestamp: firebase.database.ServerValue.TIMESTAMP,
    //             user: item.user,
    //             sent: true
    //         }
    //         console.log(item.user)
    //         console.log(item.text)
    //         this.getRoom(room).child("/texts/").push(message)
    //     });
    // }

    // parse = async (message) => {
    //     const {user, text, timestamp, sent, system} = message.val();
    //     const {key: _id} = message;
    //     const createdAt = new Date(timestamp);
    //     // user.avatar = await this.picture(user._id)   CAUSES MESSAGES TO BE REVERSED....?
    //     return {
    //         _id,
    //         createdAt,
    //         text,
    //         sent,
    //         user,
    //         system
    //     };
    // }

    // get = async (callback, room) => {
    //     this.getRoom(room).child('/texts').on('child_added', async (snapshot) => callback(await this.parse(snapshot)));
    // }

    // off(room) {
    //     this.getRoom(room).child('/texts').off();
    // }

    // getReadReceipts = (room, callback) => {
    //     this.getRoom(room).child(`/members/${this.uid}`).child('last_seen').on('value', async (snapshot) => callback(snapshot));
    // }

    // unsubscribeReadReceipts = (room) => {
    //     this.getRoom(room).child(`/members/${this.uid}`).child('last_seen').off();
    // }

    // getGroupChatListener = (add, remove) => {
    //     firebase.database().ref(`users/${this.uid}/messages`).on('child_added', async (snapshot) => add(snapshot));
    //     firebase.database().ref(`users/${this.uid}/messages`).on('child_removed', async (snapshot) => remove(snapshot));
    // }

    // unsubscribeGroupChatListener = () => {
    //     firebase.database().ref(`users/${this.uid}/messages`).off();
    // }

    // uploadPhoto = async uri => {
    //     const path = `photos/${this.uid}/profile.jpg`;

    //     return new Promise(async (res, rej) => {
    //         const response = await fetch(uri);
    //         const file = await response.blob();

    //         let upload = firebase.storage().ref(path).put(file)

    //         upload.on("state_changed", snapshot => {}, err => {
    //             rej(err)
    //         },
    //         async () => {
    //             const url = await upload.snapshot.ref.getDownloadURL();
    //             res(url)
    //             Image.prefetch(url)
    //             firebase.database().ref(`/users/${this.uid}`).update({
    //                 image: url
    //             })
    //         })
    //     })
    // }
    
    // cachePhotos = async () => {
    //     firebase.database().ref('/users').on('child_added', async (snapshot) => {
    //         let user = snapshot.val();
    //         Image.prefetch(user.image).catch(e => console.log(e))
    //     })
    // }

    // unsubscribePhotoCacheListener = () => {
    //     firebase.database().ref('/users').off();
    // }

    // leaveGroup = (room_id, callback) => {
    //     firebase.database().ref(`users/${this.uid}/messages/${room_id}`).remove().then(() => {
    //         firebase.database().ref(`messages/${room_id}/members/${this.uid}`).update({
    //             active: false
    //         }).then(() => {
    //             callback();
    //         }).catch(err => console.log);
    //     }).catch(err => console.log(err));
    // }
    
    // getCourses = async () => {
    //     let courses;
    //     await firebase.database().ref('courses').once('value')
    //         .then(data => {
    //             let js_data = data.exportVal()
    //             courses = Object.values(js_data)
    //         })
    //     return courses;
    // }

    // getMajors = async () => {
    //     let majors;
    //     await firebase.database().ref('majors').once('value')
    //         .then(data => {
    //             let js_data = data.exportVal()
    //             majors = Object.values(js_data)
    //         })
    //     return majors;
    // }

    // get users who are currenly not firends with current user
    // helper function used in getMatches
    getNonRelatedUsers = async (allUsers, currRelated, nonRelatedUsers) => {
        if (
            (currRelated != undefined) && 
            (currRelated != null) && 
            (currRelated.length != null) &&
            (currRelated.length == 0)
        ) {
            allUsers = allUsers.filter((value) => {return value !== this.uid})
            allUsers.map((user) => nonRelatedUsers.add(user))
        } else {
            // console.log("with current related users")
            allUsers.map((user)=> {
                if (user != this.uid) {
                    // console.log("current user", user)
                    let result = false;
                    currRelated.map((relatedUser) => {
                        if (relatedUser === user) {
                            result = true;
                        }
                    })
                    if (result === false) {
                        nonRelatedUsers.add(user)
                    }
                }
            })
        }
    }

    // get usrs matched with major/course
    getMatches = async (users, prefEnable) => {
        await firebase.database().ref('/users').once('value')
        .then(userData => {
            let jsUserData = (userData.val() || {}); // val(): convert to json format
            let currFriends = (jsUserData[this.uid].friends || {})
            let currRequested = (jsUserData[this.uid].requestedFriends || {})
            let currRequesting = (jsUserData[this.uid].requestingFriends || {})
            let currRelated = Object.assign(currFriends, currRequested, currRequesting)
            // console.log("current related:", currRelated)
            // set to store the current user's major(s)
            let curr_user_majors = new Set();
            for (let major in jsUserData[this.uid].majors) {
                curr_user_majors.add(jsUserData[this.uid].majors[major].name);
            }
            // set to store current user's courses
            const curr_user_courses = new Set();
            for(let course in jsUserData[this.uid].courses) {
                curr_user_courses.add(jsUserData[this.uid].courses[course].name);
            }

            // select non friends users
            let nonRelatedUsers = new Set()
            this.getNonRelatedUsers(Object.keys(jsUserData), Object.keys(currRelated), nonRelatedUsers)
            // filter relavent user

            for (let user of nonRelatedUsers) {
                let relevantUser = false;
                let all_courses = []
                let current_majors = ""
                if(prefEnable) {
                    for (let course in jsUserData[user].courses) {
                        if (curr_user_courses.has(jsUserData[user].courses[course].name)) {
                            relevantUser = true;
                        }
                        all_courses.push(jsUserData[user].courses[course].name)
                    }
                    for (let major in jsUserData[user].majors) {
                        if (curr_user_majors.has(jsUserData[user].majors[major].name)) {
                            relevantUser = true;
                        }
                        current_majors = current_majors.concat(jsUserData[user].majors[major].name)
                        current_majors = current_majors.concat("\n")
                        jsUserData[user].all_majors = current_majors
                    }
                } else {
                    relevantUser = true
                    for (let course in jsUserData[user].courses) {
                        all_courses.push(jsUserData[user].courses[course].name)
                    }
                    for (let major in jsUserData[user].majors) {
                        current_majors = current_majors.concat(jsUserData[user].majors[major].name)
                        current_majors = current_majors.concat("\n")
                        jsUserData[user].all_majors = current_majors
                    }
                }
                if (relevantUser) {
                    users.push({
                        uid: user,
                        first_name: jsUserData[user].first_name,
                        last_name: jsUserData[user].last_name,
                        bio: jsUserData[user].bio,
                        major: jsUserData[user].all_majors,
                        classes: all_courses,
                        image: jsUserData[user].image
                    });
                }
            }
        }).catch(error => {
            console.log(error)
        })
    }
    
    // group_name(others) {
    //     let group_chat_name = "";
    //     if (others.length === 1) {
    //         group_chat_name = this.firstName(others[0].name)
    //     } else if (others.length === 2) {
    //         group_chat_name = this.firstName(others[0].name) + " and " + this.firstName(others[1].name)
    //     } else if (others.length <= 3) { 
    //         for (let i = 0; i < others.length - 1; i++) {
    //             group_chat_name += this.firstName(others[i].name) + ", "
    //         }
    //         group_chat_name += "and " + this.firstName(others[others.length - 1].name)
    //     } else {
    //         for (let i = 0; i < 2; i++) {
    //             group_chat_name += this.firstName(others[i].name) + ", "
    //         }
    //         group_chat_name += "and " + (others.length - 2) + " others"
    //     }
    //     return group_chat_name
    // }

    // firstName(full_name) {
    //     // Assumes that every name's first name is at the front and no one enters
    //     // the name that has a space at the front
    //     let space_pos = full_name.search(" ")
    //     if (space_pos == -1) {
    //         // Don't have first name, use full name
    //         return full_name
    //     } else {
    //         return full_name.substring(0, space_pos)
    //     }
    // }

    // getFriendListener = (callback) => {
    //     firebase.database().ref(`users/${this.uid}/friends`).on('child_added', async (snapshot) => callback(snapshot));
    // }

    // unsubscribeFriendListener = () => {
    //     firebase.database().ref(`users/${this.uid}/friends`).off()
    // }

    // // request friends to a user
    // requestFriend(uid) {
    //     // console.log('send friend request to: ', uid, name)
    //     firebase.database().ref(`/users/${this.uid}/requestedFriends/`).update({[uid]: uid})
    //     firebase.database().ref(`users/${uid}/requestingFriends/`).update({[this.uid]: this.uid})
    // }

    // getRequestListener = (add_callback, remove_callback) => {
    //     firebase.database().ref(`users/${this.uid}/requestingFriends`).on('child_added', async (snapshot) => add_callback(snapshot));
    //     firebase.database().ref(`users/${this.uid}/requestingFriends`).on('child_removed', async (snapshot) => remove_callback(snapshot));
    // }

    // unsubscribedRequestListener = () => {
    //     firebase.database().ref(`users/${this.uid}/requestingFriends`).off();
    // }

    // getReqUsers = async (users) => {
    //     await firebase.database().ref(`users/`).once('value')
    //     .then(dataSnapShot => {
    //             let allUserData = dataSnapShot.val()
    //             for (let reqUser in allUserData[this.uid].requestingFriends){
    //                 let major_names = ""
    //                 for (let major in allUserData[reqUser].majors) {
    //                     major_names = major_names.concat(allUserData[reqUser].majors[major].name)
    //                     major_names = major_names.concat(" ")
    //                 }
    //                 allUserData[reqUser].allMajors = major_names
    //                 let course_names = []
    //                 for (let course in allUserData[reqUser].courses) {
    //                     course_names.push(allUserData[reqUser].courses[course].name)
    //                 }
    //                 users.push({
    //                     uid: reqUser,
    //                     first_name: allUserData[reqUser].first_name,
    //                     last_name: allUserData[reqUser].last_name,
    //                     bio: allUserData[reqUser].bio,
    //                     major: allUserData[reqUser].allMajors,
    //                     classes: course_names,
    //                     image: allUserData[reqUser].image,
    //                 })
    //             }
    //         }
    //     )
    // }

    // displayRecent(text, createdAt, user) {
    //     if (text && createdAt) {
    //         if (user.name === "System") {
    //             return text;
    //         }
    //         let result = (user.uid === (this.uid) ? "You" : this.firstName(user.name)) + ": "
    //         if (text.length < 30) {
    //             result += text;
    //         } else {
    //             result += text.substring(0, 30) + "...";
    //         }
    //         let date = new Date(createdAt)
    //         let now = new Date()
    //         let difference_in_days = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)   // milliseconds * seconds * minutes * hours
    //         if (difference_in_days < 1) {  // within same day
    //             let hours = date.getHours();
    //             let minutes = date.getMinutes();
    //             let amPm = hours >= 12 ? "pm" : "am";
    //             hours %= 12;
    //             hours = hours !== 0 ? hours : 12;
    //             minutes = minutes < 10 ? "0" + minutes : minutes;
    //             result += " " + hours + ":" + minutes + " " + amPm;
    //         } else if (difference_in_days < 7) {
    //             let day = date.toString().split(" ")[0]
    //             result += " " + day
    //         } else {
    //             let arr =  date.toString().split(" ")
    //             let day = arr[1] + + " " + arr[2]
    //             result += " " + day
    //         }
    //         return result;
    //     }
    // }

    // // helper function: manually add friend request to current user for testing
    // addRequest(uid, name) {
    //     firebase.database().ref(`users/${this.uid}/requestingFriends/`).update({[uid]: name})
    // }

    // // remove a friend request in given user who request friend to current user
    // removeRequest(uid) {
    //     firebase.database().ref(`users/${this.uid}/requestingFriends/${uid}`).remove()
    //     .then(() => {  
    //         // console.log('remove user ', uid, name, 'from the requesting list')
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    //     firebase.database().ref(`users/${uid}/requestedFriends/${this.uid}`).remove()
    //     .then(() => {
    //         // console.log('remove current user', this.uid, this.name, 'from the requested list')
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    // // confirm a friend request:
    // // 1) add both users to their corresponding friend list
    // // 2) remove both users from requested/requesting list
    // confirmRequest(uid, first_name, last_name) {
    //     // create a message room for both people
    //     firebase.database().ref('/messages').push({ 
    //         texts: [
    //             {
    //                 _id: 1,
    //                 text: 'Say hi to your new friend!',
    //                 timestamp: firebase.database.ServerValue.TIMESTAMP,
    //                 user: {
    //                     _id: 1,
    //                     name: "System"
    //                 },
    //                 system: true
    //             }
    //         ],
    //         group_name: ""
    //     }).then(snap => {
    //         firebase.database().ref(`/messages/${snap.key}/members/`).set({
    //             [uid]: {
    //                 first_name: first_name,
    //                 last_name: last_name,
    //                 last_seen: null
    //             },
    //             [this.uid]: {
    //                 first_name: `${this.first_name}`,
    //                 last_name: `${this.last_name}`,
    //                 last_seen: null
    //             },
    //         });
    //         // add to friends list
    //         firebase.database().ref(`users/${this.uid}/friends/`).set({
    //             [uid]: {
    //                 first_name: first_name,
    //                 last_name: last_name,
    //                 room: snap.key,
    //             }
    //         })
    //         .then(() => {
    //             // console.log('add user', uid, name, 'to', this.name+'\'s friends list')
    //         }).catch((error) => {
    //             console.log(error)
    //         })
    //         // add to friends list
    //         firebase.database().ref(`users/${uid}/friends/`).set({
    //             [this.uid]: {
    //                 first_name: `${this.first_name}`,
    //                 last_name: `${this.last_name}`,
    //                 room: snap.key,
    //             }
    //         })
    //         .then(() => {
    //             // console.log('add current user', this.uid, this.name, 'to', name+'\'s friends list')
    //         }).catch((error) => {
    //             console.log(error)
    //         })
    //     })

    //     // remove from requested/requesting lists
    //     firebase.database().ref(`users/${this.uid}/requestingFriends/${uid}`).remove()
    //     .then(() => {  
    //         // console.log('remove user ', uid, name, 'from the requesting list')
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    //     firebase.database().ref(`users/${uid}/requestedFriends/${this.uid}`).remove()
    //     .then(() => {
    //         // console.log('remove current user', this.uid, this.name, 'from the requested list')
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    // removeFriend(uid){
    //     console.log(`remove ${uid} from ${this.uid}'s friends list`)
    //     firebase.database().ref(`users/${this.uid}/friends/${uid}`).remove()
    // }

    // //|-------- helper functions ---------| 

    // // remove all requested/requesting users
    // removeAllFriends = async () => {
    //     await firebase.database().ref('/users').once('value')
    //     .then(userData => {
    //         let jsUserData = (userData.val() || {})
    //         for (let uid in jsUserData) {
    //             console.log("remove requested/requesting user for user:", uid)
    //             firebase.database().ref(`users/${uid}/requestedFriends`).remove()
    //             firebase.database().ref(`users/${uid}/requestingFriends`).remove()
    //             firebase.database().ref(`users/${uid}/friends`).remove()
    //         }
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    
}

export default new Fire();