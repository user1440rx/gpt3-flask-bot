from flask import Flask, render_template, request, send_from_directory
import os
import openai
from time import time,sleep

app = Flask(__name__, static_folder='static/react-chat')


def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as infile:
        return infile.read()

# Create an openaiapikey.txt file and save your api key.
openai.api_key = open_file('openaiapikey.txt')
openai.api_key = openai.api_key.rstrip('\n')


def bot(prompt, engine='text-davinci-002', temp=0.9, top_p=1.0, tokens=1000, freq_pen=0.0, pres_pen=0.5, stop=['<<END>>']):
    max_retry = 1
    retry = 0
    while True:
        try:
            response = openai.Completion.create(
                engine=engine,
                prompt=prompt,
                temperature=temp,
                max_tokens=tokens,
                top_p=top_p,
                frequency_penalty=freq_pen,
                presence_penalty=pres_pen,
                stop=[" User:", " AI:"])
            text = response['choices'][0]['text'].strip()
            print(text)
            filename = '%s_gpt3.txt' % time()
            with open('gpt3_logs/%s' % filename, 'w') as outfile:
               outfile.write('PROMPT:\n\n' + prompt + '\n\n==========\n\nRESPONSE:\n\n' + text)
            return text
        except Exception as oops:
            retry += 1
            if retry >= max_retry:
                return "GPT3 error: %s" % oops
            print('Error communicating with OpenAI:', oops)
            sleep(1)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    botresponse = bot(prompt =userText)
    return str(botresponse)

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
