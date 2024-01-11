import cv2 
import numpy as np
from scipy import interpolate

def downscale(filepath,scale):

    colorimage = filepath
    #image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    newColor = []

    colors = [colorimage[:,:,0], colorimage[:,:,1], colorimage[:,:,2]]

    for image in colors:
        newimage = []

        image = image.astype(int)

        for row in image:
            newrow = []
            pixel = 0
            coeffs = interpolate.splrep(range(len(row)), row)
            for i in range(len(row)//scale):
                newrow.append(int(interpolate.splev(pixel, coeffs)))
                pixel += scale
            newimage.append(newrow)

        newimage = np.transpose(newimage)
        I2mage = []

        for row in newimage:
            newrow = []
            pixel = 0
            coeffs = interpolate.splrep(range(len(row)), row)
            for i in range(len(row)//scale):
                newrow.append(int(interpolate.splev(pixel, coeffs)))
                pixel += scale
            I2mage.append(newrow)

        newimage = np.array(I2mage)

        newimage = np.transpose(newimage)

        newimage = newimage.astype(np.uint8)

            
        newColor.append(newimage)
        
    # make it [][][3] instead of [3][][]

    newColor = np.transpose(newColor, (1,2,0))
    newColor = np.array(newColor)

    # cv2.imshow('newimage', newColor)
    # cv2.waitKey(0)

    # cv2.imwrite(exportpath, newColor)
    
    return newColor