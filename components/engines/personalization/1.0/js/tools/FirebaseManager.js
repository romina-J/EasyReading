
//    "scripts": ["lib/jquery/jquery.js","background/background-script.js","background/firebase-manager.js","background/auth-manager.js"]

//TODO: maybe use https://github.com/invertase/react-native-firebase ?
// import * as GlobalFunctions from '../GlobalFunctions';
// import { writeToProfile } from '../ServerFunctions';

// import app from 'firebase/app';
// import 'firebase/auth';
// import firebase from 'firebase';


// const firebase = require('firebase');

console.log("firebase-manager on popup");
// alert("fb manager2");
var config = {
    apiKey: "AIzaSyADh_1XJxqlx7tWhgEiuPc9HuD_q-KCDik",
    authDomain: "personalization-f08cf.firebaseapp.com",
    databaseURL: "https://personalization-f08cf.firebaseio.com",
    projectId: "personalization-f08cf",
    storageBucket: "personalization-f08cf.appspot.com",
    messagingSenderId: "363386720890"
};
firebase.initializeApp(config);
// const auth = firebase.auth();
let database = firebase.database();
// let storage = firebase.storage();
// var provider = new firebase.auth.GoogleAuthProvider();



var firebase_manager = {
    isLogged: false,

    readData: async function (ref, callback) {
        console.log("readdata called for: " + ref);
        var starCountRef = database.ref(ref);
        return await starCountRef.once('value');

    },
    writeData: async function (ref, data) {
        console.log("writedata called for: " + ref);
        var starCountRef = database.ref(ref);
        return await starCountRef.set(data);

    },

    getSymbolSrc: async function (symbolName,auiSymbolSource) {
        let snapshot = await this.readData("symbol-mappings/" + symbolName+"/"+auiSymbolSource);
        return snapshot.val();  
    },
    writeSymbolMapping(){
        console.log("popup- write symbol mapping called");
        let data = 
        { 
                '18209':{ //water
                    bliss: 'http://blissymbolics.net/refnumber/18209',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/200/2/2248.png'
                },
                '17511':{ //tea
                    bliss: 'http://blissymbolics.net/refnumber/17511',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/200/2/29802.png'
                },
                '23485':{ //email
                    bliss: 'http://blissymbolics.net/refnumber/23485',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/200/5/5432.png'
                },
                '12657':{ //start
                    bliss: 'http://blissymbolics.net/refnumber/12657',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/5/5431.png'
                },
                '18267':{ //with
                    bliss: 'http://blissymbolics.net/refnumber/18267',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7064.png'
                },
                '16440':{ //fill
                    bliss: 'http://blissymbolics.net/refnumber/16440',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7146.png'
                },
                '8497':{ //1
                    bliss: 'http://blissymbolics.net/refnumber/8497',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2627.png'
                },
                '13621':{ //cup
                    bliss: 'http://blissymbolics.net/refnumber/13621',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2582.png'
                },
                '13918':{ //plug
                    bliss: 'http://blissymbolics.net/refnumber/13918',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2373.png'
                },
                '25627':{ //turn
                    bliss: 'http://blissymbolics.net/refnumber/25627',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/6/6006.png'
                },
                '15918':{ //on
                    bliss: 'http://blissymbolics.net/refnumber/15918',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7814.png'
                },
                '14696':{ //hot
                    bliss: 'http://blissymbolics.net/refnumber/14696',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/4/4583.png'
                },
                '14900':{ //boil
                    bliss: 'http://blissymbolics.net/refnumber/14900',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/5/5485.png'
                },
                '18030':{ //wait
                    bliss: 'http://blissymbolics.net/refnumber/18030',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/1/16091.png'
                },
                '12618':{ //bag
                    bliss: 'http://blissymbolics.net/refnumber/12618',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/23849.png'
                },
                '15468':{ //milk
                    bliss: 'http://blissymbolics.net/refnumber/15468',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2445.png'
                },
                '18035':{ //desired
                    bliss: 'http://blissymbolics.net/refnumber/18035',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/5/5441.png'
                },
                '12338':{ //add
                    bliss: 'http://blissymbolics.net/refnumber/12338',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/5/5868.png'
                },
                '14952':{ //into
                    bliss: 'http://blissymbolics.net/refnumber/14952',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7034.png'
                },
                '8499':{ //three
                    bliss: 'http://blissymbolics.net/refnumber/8499',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2629.png'
                },
                '17982':{ //to
                    bliss: 'http://blissymbolics.net/refnumber/17982',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7194.png'
                },
                '8501':{ //five
                    bliss: 'http://blissymbolics.net/refnumber/8501',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2631.png'
                },
                '15475':{ //minutes
                    bliss: 'http://blissymbolics.net/refnumber/15475',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/12/50/2/22679.jpg'
                },
                '17448':{ //remove
                    bliss: 'http://blissymbolics.net/refnumber/17448',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/1/11751.png'
                },
                '14927':{ //if
                    bliss: 'http://blissymbolics.net/refnumber/14927',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/28359.png'
                },
                '17233':{ //spoon
                    bliss: 'http://blissymbolics.net/refnumber/17233',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2362.png'
                },
                '25815':{ //sugar
                    bliss: 'http://blissymbolics.net/refnumber/25815',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/25560.png'
                },
                '13882':{ //drink
                    bliss: 'http://blissymbolics.net/refnumber/13882',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/5/50/3/3480.png'
                },
                '13409':{ //biscuits
                    bliss: 'http://blissymbolics.net/refnumber/13409',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2402.png'
                },
                '15972':{//part
                    bliss: 'http://blissymbolics.net/refnumber/15972',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/5/5436.png'
                },
                '16244':{//set
                    bliss: 'http://blissymbolics.net/refnumber/16244',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2872.png'
                },
                '12904':{//bring
                    bliss: 'http://blissymbolics.net/refnumber/12904',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7280.png'
                },
                '8498':{//2
                    bliss: 'http://blissymbolics.net/refnumber/8498',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2628.png'
                },
                '15196':{//let
                    bliss: 'http://blissymbolics.net/refnumber/15196',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/21010.png'
                },
                '16245':{//cook
                    bliss: 'http://blissymbolics.net/refnumber/16245',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/2342.png'
                },
                '12374':{//and
                    bliss: 'http://blissymbolics.net/refnumber/12374',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/1/11399.png'
                },
                '14675':{//enjoy (arasaac: enjoy meal) (bliss: fun)
                    bliss: 'http://blissymbolics.net/refnumber/14675',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/1/11627.png'
                },
                '24844':{//done
                    bliss: 'http://blissymbolics.net/refnumber/24844',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/28429.png'
                },
                '13403':{//container (arasaac: teapot)
                    bliss: 'http://blissymbolics.net/refnumber/13403',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7276.png'
                },
                '13690':{// dish (arasaac: serve)
                    bliss: 'http://blissymbolics.net/refnumber/13690',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7247.png'
                },
                '14907':{// how
                    bliss: 'http://blissymbolics.net/refnumber/14907',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/1/12313.png'
                },
                '12324':{// of
                    bliss: 'http://blissymbolics.net/refnumber/12324',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/7/7074.png'
                },
                '15410':{// make
                    bliss: 'http://blissymbolics.net/refnumber/15410',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/3/32751.png'
                },
                '25522':{// off
                    bliss: 'http://blissymbolics.net/refnumber/25522',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/2/21365.png'
                },
                '13375':{// cold
                    bliss: 'http://blissymbolics.net/refnumber/13375',
                    arasaac: 'http://www.arasaac.org/repositorio/thumbs/10/50/4/4652.png'
                },
                
        }
        this.writeData('symbol-mappings/',data);    
        
    }

}


/*Handle the popup's login/logout button text  */
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.get === "getLoginButtonText") {
//             var text;
//             if (firebase_manager.isLogged) {
//                 text = "Logout"
//             } else {
//                 text = "Login"
//             }
//             sendResponse({ loginButtonText: text });
//         }
//     });

function closePopup() {
    // var windows = chrome.extension.getViews({ type: "popup" });
    // if (windows.length) {
    //     windows[0].close(); // Normally, there shouldn't be more than 1 popup 
    // } else {
    //     console.log("There was no popup to close");
    // }
}