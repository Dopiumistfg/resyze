import cv2 
import numpy as np
from scipy import interpolate

def upscale(filepath,scale):

    colorimage = filepath
    #image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    newColor = []

    colors = [colorimage[:,:,0], colorimage[:,:,1], colorimage[:,:,2]]

    for image in colors:

        newimage = []

        for row in image:
            for element in row:
                element = int(element)

        for row in image:
            newrow = []
            pixel = 0
            coeffs = interpolate.splrep(range(len(row)), row)
            for i in range(len(row)*scale):
                newrow.append(int(interpolate.splev(pixel, coeffs)))
                pixel += 1/scale
            newimage.append(newrow)

        newimage = np.transpose(newimage)
        I2mage = []

        for row in newimage:
            newrow = []
            pixel = 0
            coeffs = interpolate.splrep(range(len(row)), row)
            for i in range(len(row)*scale):
                newrow.append(int(interpolate.splev(pixel, coeffs)))
                pixel += 1/scale
            I2mage.append(newrow)

        newimage = np.array(I2mage)

        newimage = np.transpose(newimage)

        newimage = newimage.astype(np.uint8)
        
        newColor.append(newimage)


    newColor = np.transpose(newColor, (1,2,0))
    newColor = np.array(newColor)

    return newColor