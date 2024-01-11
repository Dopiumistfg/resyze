# ReSyze
A polynomial regression based app for upscaling or downscaling images


## How it works
Using polynomial regression, A function is created that defines the curve for a set of points 'n'

For Example:

For a set of numbers {1,2,3,4,5,6,7,8}

A function y = x is extracted, to downscale, say to 1/2, we can say maxElements = n/2
and the range at which we get  y value = 2x

hence new list would be {1,3,5,7}

and for upscaling {1,1.5,2,2.5 and so on}

Now considering an image is a 3d array of size {x,y,3}
we split red, green,blue into different arrays and calculate this function, 
then we can upscale or downscale and merge the new array to give a final new image

## How to run it

You will need to have pip and npm installed,

then open the folder and run 
```
pip install -r requirements.txt
npm install
```

then run 
```
npm start
```
