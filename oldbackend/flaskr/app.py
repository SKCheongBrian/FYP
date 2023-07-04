from flask import Flask
from flask import request
from flask import send_file
import glob
# TODO: Use uuid to allow multiple queries at once
import uuid
import shutil
import os

app = Flask(__name__)

def produce_uml(filename):
    os.system(f"java -jar plantuml-1.2023.2.jar ./temp/test")

def find_uml():
    for file in glob.glob("./temp/*.png"):
        return file
    
def clear_temp():
    folder = './temp'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


@app.route('/')
def hello():
    return "Hello"

@app.route('/upload', methods=['POST'])
def file():
    if request.method == 'POST':
        f = request.files['file']
        print(f.filename)
        f.save("./temp/test")
        produce_uml(f.filename)
        uml = find_uml()
        try:
            file_to_send = send_file(uml)
        except Exception as e:
            print(str(e))
        clear_temp()
        return file_to_send
