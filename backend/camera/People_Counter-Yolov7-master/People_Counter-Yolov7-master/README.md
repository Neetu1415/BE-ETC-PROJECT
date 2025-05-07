# People Counter Using ML

## Features
- Added Label for Every Track
- Code can run on Both (CPU & GPU)
- Video/WebCam/External Camera/IP Stream Supported
- Can store the footage for future reference in compressed format to save storage space and time.
- Also stores the data in text format.

## Steps to run Code
- Clone the repository.

- Create a  envirnoment (Recommended, If you dont want to disturb python packages)

- Install all the packages :
```

### For Linux Users
python3 -m pip install -r requirements.txt

### For Window Users
python -m pip install -r requirements.txt
```

- Give the IP address of the Camera in the sources.txt file, keep adding the urls of the cameras on new line at a time.

- Run the project: ``` python detect.py ```


## TODO
1. Not able to display the frames, when using multicamera setup, only able to store the data. This may be due to the resolution variations of the different camearas used.
2. Need to create a good GUI, with better control features, will  able to show may be different camera footage on multiple boxes in same screen.
