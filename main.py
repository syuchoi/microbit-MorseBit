def on_button_pressed_a():
    global radio2, listcount
    if currentMod == 0:
        radio2 += -1
    elif currentMod == 1:
        listcount += -1
    else:
        pass
    update()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():
    global currentMod, listcount
    if currentMod == 0:
        OLED.clear()
        OLED.write_string_new_line("cur radio group: " + ("" + str(radio2)))
        radio.set_group(radio2)
        basic.pause(1000)
        currentMod = 1
        OLED.clear()
        OLED.write_string_new_line("cur message: ")
        OLED.write_string_new_line(">> " + messageTemplate[0])
    elif currentMod == 1:
        message.append(messageTemplate[listcount])
        listcount = 0
        OLED.clear()
        update()
    else:
        pass
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global radio2, listcount
    if currentMod == 0:
        radio2 += 1
    elif currentMod == 1:
        listcount += 1
    else:
        pass
    update()
input.on_button_pressed(Button.B, on_button_pressed_b)

def update():
    global radio2, listcount
    if currentMod == 0:
        if radio2 <= 0:
            radio2 = 255
        elif radio2 >= 255:
            radio2 = 0
        OLED.clear()
        OLED.write_string_new_line("radio group: " + ("" + str(radio2)))
    elif currentMod == 1:
        if listcount < 0:
            listcount = len(messageTemplate) - 1
        elif listcount >= len(messageTemplate):
            listcount = 0
        OLED.clear()
        OLED.write_string_new_line("cur message: " + ("" + str(message)))
        OLED.write_string_new_line(">> " + messageTemplate[listcount])
    else:
        pass
def list2string(str_list: List[any]):
    global result
    for s in str_list:
        result = "" + result + str(s) + " "
    return result.strip()
listcount = 0
message: List[str] = []
messageTemplate: List[str] = []
currentMod = 0
radio2 = 0
result = ""
callSign = convert_to_text(control.device_name().to_upper_case())
radio2 = 0
currentMod = 0
messageTemplate = ["CQ",
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
    "111",
    "ES",
    "HW?",
    "AR",
    "KN",
    "HI",
    "CU AGN",
    "73",
    "TU",
    "E"]
message = []
OLED.init(128, 64)
OLED.write_string_new_line("radio group: " + ("" + str(radio2)))

def on_forever():
    basic.show_number(currentMod)
basic.forever(on_forever)
