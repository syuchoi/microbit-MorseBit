input.onGesture(Gesture.TiltRight, function () {
    if (currentMod == 1) {
        OLED.clear()
        isMute = !(isMute)
        OLED.writeStringNewLine(isMute ? "-MUTE-" : "-SOUND-")
        basic.pause(1000)
        update()
    }
})
input.onGesture(Gesture.TiltLeft, function () {
    if (currentMod == 1) {
        isDeleteMode = !(isDeleteMode)
        update()
    }
})
input.onButtonPressed(Button.A, function () {
    if (currentMod == 0) {
        radio2 += -1
    } else if (currentMod == 1) {
        if (isDeleteMode) {
            if (manualMod == 0) {
                if (message.length != 0) {
                    message.pop()
                    list2string(message)
                }
            } else {
                if (morseInput == "") {
                    finalMessage = finalMessage.slice(0, -1)
                } else {
                    morseInput = morseInput.slice(0, -1)
finalMorse = morseInput
                }
            }
        } else {
            if (manualMod == 0) {
                listcount += -1
            } else {
                sndPlay(false)
                morseInput = "" + morseInput + "."
                finalMorse = morseInput
            }
        }
    } else {
    	
    }
    update()
})
function sndPlay (bool: boolean) {
    if (!(isMute)) {
        if (bool) {
            music.playTone(784, music.beat(BeatFraction.Eighth) * 3)
        } else {
            music.playTone(784, music.beat(BeatFraction.Eighth))
        }
    }
}
function eng2morse (text: string) {
    morseText = []
    for (let char of text) {
        index = alphabet.indexOf(char)
        if (index != -1) {
            morseText.push(morseList[index])
        } else {
            morseText.push(" ")
        }
    }
    return morseText.join(" ")
}
input.onButtonPressed(Button.AB, function () {
    if (currentMod == 0) {
        OLED.clear()
        OLED.writeStringNewLine("Radio Group Set: " + radio2)
        radio.setGroup(radio2)
        basic.pause(1000)
        currentMod = 1
        update()
    } else if (currentMod == 1) {
        if (manualMod == 0) {
            message = finalMessage.split(" ")
            message.push(messageTemplate[listcount])
            list2string(message)
        } else {
            finalMorse = ""
            if (morseInput != "") {
                morse2eng(morseInput)
                morseInput = ""
                finalMessage = "" + finalMessage + finalMorse
            } else {
                finalMessage = "" + finalMessage + " "
            }
        }
        update()
    } else if (currentMod == 2) {
        if (YN == "Y") {
            OLED.clear()
            for (let j = 0; j < finalMessage.length; j += 18) {
                const chunk = finalMessage.slice(j, j + 18);
                radio.sendString("" + chunk);
            }
radio.sendString("%DONE%")
            OLED.writeStringNewLine("Sended.")
            morseInput = eng2morse(finalMessage)
            basic.pause(2000)
        }
        listcount = 0
        morseInput = ""
        finalMorse = ""
        finalMessage = ""
        message = []
        currentMod = 1
        update()
    } else if (currentMod == 3) {
        currentMod = 1
        update()
    } else {
        OLED.clear()
    }
})
radio.onReceivedString(function (receivedString) {
    if (currentMod != 0) {
        if (currentMod == 3) {
            if (receivedString == "%DONE%") {
                receivedTemp = eng2morse(receivedTemp)
                morsePlayer(receivedTemp)
                receivedTemp = ""
            } else {
                receivedTemp = "" + receivedTemp + receivedString
                OLED.writeStringNewLine(receivedString)
            }
        }
        if (currentMod != 3) {
            currentMod = 3
            OLED.clear()
            OLED.writeStringNewLine("-Received-")
            OLED.writeStringNewLine("RST: " + radio.receivedPacket(RadioPacketProperty.SignalStrength))
            OLED.writeStringNewLine(">> " + receivedString)
            receivedTemp = receivedString
        }
    }
})
input.onButtonPressed(Button.B, function () {
    if (currentMod == 0) {
        radio2 += 1
    } else if (currentMod == 1) {
        if (manualMod == 0) {
            listcount += 1
        } else {
            sndPlay(true)
            morseInput = "" + morseInput + "-"
            finalMorse = morseInput
        }
    } else {
    	
    }
    update()
})
function update () {
    if (currentMod == 0) {
        if (radio2 < 0) {
            radio2 = 255
        } else if (radio2 > 255) {
            radio2 = 0
        }
        OLED.clear()
        OLED.writeStringNewLine("Radio Group: " + radio2)
    } else if (currentMod == 1) {
        if (manualMod == 0) {
            if (listcount < 0) {
                listcount = messageTemplate.length - 1
            } else if (listcount >= messageTemplate.length) {
                listcount = 0
            }
        }
        OLED.clear()
        if (isDeleteMode) {
            OLED.writeStringNewLine("-DELETE MODE-")
        } else {
            OLED.writeStringNewLine("-WRITE MODE-")
        }
        OLED.writeStringNewLine("Message: " + finalMessage)
        if (manualMod == 1) {
            OLED.writeStringNewLine("Morse Input: " + finalMorse)
        } else {
            OLED.writeStringNewLine(">> " + messageTemplate[listcount])
        }
    } else if (currentMod == 2) {
        OLED.clear()
        OLED.writeStringNewLine("Final Message: " + finalMessage)
        OLED.writeStringNewLine("Send?")
        if (YN == "Y") {
            YN = "N"
        } else {
            YN = "Y"
        }
        OLED.writeStringNewLine(">> " + YN)
    } else {
    	
    }
}
// trim 빼야하나
function list2string (str_list: any[]) {
    result = ""
    for (let s of str_list) {
        result = "" + result + s + " "
    }
    finalMessage = result.trim();
}
function morsePlayer (text: string) {
    for (let i = 0; i <= text.length; i++) {
        if (text.charAt(i) == ".") {
            sndPlay(false)
        } else if (text.charAt(i) == " ") {
            music.rest(music.beat(BeatFraction.Eighth) * 3)
        } else {
            sndPlay(true)
        }
        music.rest(music.beat(BeatFraction.Eighth))
    }
}
function morse2eng (text: string) {
    morseCode = text
    index3 = morseList.indexOf(morseCode)
    if (index3 != -1) {
        finalMorse = alphabet.charAt(index3)
    } else {
        finalMorse = "undefined"
    }
}
let buttonElapsed = 0
let endPressedTime = 0
let startPressedTime = 0
let index3 = 0
let morseCode = ""
let receivedTemp = ""
let YN = ""
let index = 0
let listcount = 0
let finalMorse = ""
let message: string[] = []
let alphabet = ""
let morseList: string[] = []
let messageTemplate: string[] = []
let isDeleteMode = false
let manualMod = 0
let currentMod = 0
let radio2 = 0
let morseText: string[] = []
let engText = ""
let morse = ""
let index4 = 0
let finalMessage = ""
let currentTime = 0
let morseInput = ""
let result = ""
let isMute = false
let callSign = convertToText(control.deviceName().toUpperCase())
radio2 = 0
currentMod = 0
manualMod = 0
isDeleteMode = false
isMute = false
music.setTempo(125)
messageTemplate = [
"CQ",
"DE",
callSign,
"K",
"R",
"BT",
"GA",
"GM",
"GE",
"DR",
"OM",
"TNX",
"FER",
"UR",
"CALL",
"RST",
"599",
"LOW",
"ES",
"HW?",
"AR",
"KN",
"HI",
"CU AGN",
"73",
"TU",
"E"
]
morseList = [
".-",
"-...",
"-.-.",
"-..",
".",
"..-.",
"--.",
"....",
"..",
".---",
"-.-",
".-..",
"--",
"-.",
"---",
".--.",
"--.-",
".-.",
"...",
"-",
"..-",
"...-",
".--",
"-..-",
"-.--",
"--..",
"-----",
".----",
"..---",
"...--",
"....-",
".....",
"-....",
"--...",
"---..",
"----.",
"..--.."
]
alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?"
OLED.init(128, 64)
OLED.writeStringNewLine("Radio Group: " + radio2)
basic.forever(function () {
    if (currentMod == 1) {
        // 제발 버그 죽어
        if (input.pinIsPressed(TouchPin.P2)) {
            if (startPressedTime == 0) {
                // 길게 누름
                startPressedTime = input.runningTime()
            }
        } else {
            if (startPressedTime != 0) {
                endPressedTime = input.runningTime()
                buttonElapsed = endPressedTime - startPressedTime
                startPressedTime = 0
                // 1초임 헷갈리지 말것
                if (buttonElapsed >= 1000) {
                    currentMod = 2
                    YN = "Y"
                } else {
                    if (manualMod == 0) {
                        manualMod = 1
                    } else {
                        manualMod = 0
                    }
                }
                update()
            }
        }
    }
})
