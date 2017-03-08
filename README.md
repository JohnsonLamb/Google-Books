# Google-Books
A single page application that uses the Google Books API to list books based on user search terms

--03/03/2017--
This was a Coding Task I did as part of an interview process for Javascript Developer position. 

"The task was simple: Write a single page application that queries the Google Books API based on search terms provided by the user 
and displays on the browser. Use vanilla ES5 (jQuery allowed). Document the code. For extra merit: specify searching for author or title,
pagination of results, sorting by title, publishing year or author, responsive design."

Having been able to succesfully complete the task as well as the extras (sorting option was only by publishing date) I decided to upload
to github for future improvements.

Some notes at the time of completion
- For the responsive layout I used bootstrap framework. (I assume the framework restrictions were only applicable to the JavaScript side)
- The Google Books API has two ordering methods built in: Relevance and Published Date. Those were the ones I implemented. At first glance
I don't see how to quickly organize all the data since it's fetched in blocks.
- To make new searches after changing the search parameters (author, title, publish date and relevance) it is necessary to press the search button again.
- I have included a small image to explain the interface (intructions.png) 

--08-03-2017--

Hid the API key from the public. In order to get the website to work follow these steps:
- Get your own google books API: https://support.google.com/cloud/answer/6158862.
- Don't forget to activate your API key.
- Go to the config.js file and replace the 'Nothing to see here' with your own API key. (insert the key inside brackets ' ')
- Now the application is working.
