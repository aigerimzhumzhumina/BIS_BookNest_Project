from googletrans import Translator

def auto_translate(text, dest_lang):
    translator = Translator()
    try:
        translation = translator.translate(text, dest=dest_lang)
        return translation.text
    except:
        return text