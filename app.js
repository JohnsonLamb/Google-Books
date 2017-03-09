
$( document ).ready(function() {
	
	//Variables
	var _searchText; //variable to store the text the user inserted in the text box
	var _apiKey = ':keyes&key=' + config.MY_KEY; //variable containing the last parameter of the GET request and the API key
	var _apiURL = "https://www.googleapis.com/books/v1/volumes?q="; //variable containing the URL for the GET request
	var _searchType=""; //variable to define the type of search: author name or title
	var _maxResults = 10; //variable to control the amount of results per page
	var _startIndex = 0; //variable to control the position in the collection of volumes
	var _totalResults = 0; //variable that holds the total number of results fetched with the GET request
	var _orderType =""; //Variable that controls the results order - Relevance or Publish Date
	
	
//function that handles the event after clicking "Search" or pressing ENTER key
$( "#searchForm" ).submit(function( event ) {
	cleanData();
	_searchText = $("#searchForm input:text").val(); //get the text value to be used as a search paramenter
	switch ($("#typeSearch").val()){
		case "Author":
			_searchType = "+inauthor";
			break;
		case "Title":
			_searchType = "+intitle";
			break;
		case "-":
			_searchType ="";
			break;
		default:
			_searchType ="";
	}
	switch ($("#orderSearch").val()){
		case "Relevance":
			_orderType = "";
			break;
		case "Publish Date":
			_orderType = "&orderBy=newest";
			break;
		default:
			_orderType = "";
	}
	//tests if the text box is empty
	if (_searchText ==""){
		//first clean all the things!
		cleanTotalResults();
		cleanBooks();
		cleanPagination();
		cleanData();
		//tell the user no text was found
		$("#searchResults").append("No search text found, please try again");
	}else{//text box is not empty, procceed with search
	requestBooks(_searchText,_startIndex,_maxResults,_searchType,_orderType);}
  event.preventDefault();
}); //Submit event
	
//Function that creates and sends the GET request to google API
//it takes the searched text (_searchText), the staring index (_startIndex), the number of results to display (_maxResults) and the type of search (_sarchType)
function requestBooks(_searchText,_startIndex,_maxResults,_searchType,_orderType){
	//----Sending the GET request----
	var _xhr = new XMLHttpRequest(); //initializing the XMLHttpRequest object
	//defining the request: type GET, URL made up from the variables defined earlier, true means asychronous
	var _url = _apiURL+_searchText+_searchType+_apiKey+"&startIndex="+_startIndex+"&maxResults="+_maxResults+_orderType; //defining the URL to send
	_xhr.open('GET', _url, true);
	_xhr.send(); //sends the request
	//creating an event listener tied to the "readystatechange" that launches the "processRequest" function
 	_xhr.addEventListener("readystatechange", processRequest, false); 
	function processRequest(e) {
		//readystate = 4 means Data is ready to be proccessed
		if (_xhr.readyState == 4 && _xhr.status == 200) {
			var _response = JSON.parse(_xhr.responseText); //transform the response text into a JSON object
			displayTotalResults(_response);
			displayResults(_response);
			createPagination(_response);
		}
	}
	
} //requestBooks

//function to create pagination
function createPagination(_response){
	cleanPagination();
	_totalResults = _response.totalItems;
	//if _startIndex = 0 it means it's the first batch of book data
	//if _totalResults > _maxResults, it means there is more data to be fetched.
	if (_startIndex == 0 && _totalResults>_maxResults){
		_previousIndex = _startIndex;
		_startIndex =_startIndex + _maxResults; 
		$("#pagination").prepend("<a href='#' id='next'>Next</a>");
		//create the function to handle a click to the newly added "NEXT" link
		$("#next").click(function() {
			requestBooks(_searchText,_startIndex,_maxResults,_searchType,_orderType);
			$('html, body').animate({ scrollTop: 0 }, 'slow'); //go to the top of the page, smoothly
			event.preventDefault();
		});
	}else{
		// checks if _startIndex is lower than total results and if the itens to display are the same as the maximum results per page
		if (_startIndex !=0 && _startIndex < _totalResults && _response.items.length == _maxResults){
			cleanPagination();
			$("#pagination").prepend("<a href='#' id='previous'>Previous</a><a href='#' id='next'>Next</a>");
			//create the function to handle a click to the newly added "NEXT" link
			$("#next").click(function() {
				_startIndex =_startIndex + _maxResults;
				requestBooks(_searchText,_startIndex,_maxResults,_searchType,_orderType);
				$('html, body').animate({ scrollTop: 0 }, 'slow'); //go to the top of the page, smoothly
				event.preventDefault();
			});
			//create the function to handle a click to the newly added "PREVIOUS" link
			$("#previous").click(function() {
				_startIndex =_startIndex - _maxResults;
				requestBooks(_searchText,_startIndex,_maxResults,_searchType,_orderType);
				$('html, body').animate({ scrollTop: 0 }, 'slow');
				event.preventDefault();
			});
		//when all the other checks fail it means there are no further Books to get. Only the "Previous" link is shown and _startIndex is set back by _maxResults amount to get the previous Books
		}else{	if(_startIndex !=0){
				cleanPagination();
				//create the function to handle a click to the newly added PREVIOUS link
				$("#pagination").prepend("<a href='#' id='previous'>Previous</a>");
				$("#previous").click(function() {
					_startIndex =_startIndex - _maxResults;
					requestBooks(_searchText,_startIndex,_maxResults,_searchType,_orderType);
					$('html, body').animate({ scrollTop: 0 }, 'slow'); ////go to the top of the page, smoothly
					event.preventDefault();
		});}
			}
	}
}
//function to clean the pagination Div
function cleanPagination(){
	$("#pagination").empty();
}

//function that writes the total number of results found
function displayTotalResults(_response){
	cleanTotalResults();
	
	$("#searchResultsText").prepend("A total of <b>"+ _response.totalItems +"</b> results have been found with the keyword <b>"+ _searchText +"</b>");
}//displayTotalResults

//function that takes the data from the Get Request and displays on the page
function displayResults(_response){
	cleanBooks();
	for (i=0;i<_response.items.length;i++){
				console.log(_response.items[i].volumeInfo.title)
				$("#searchResults").append("<div class ='bookTitleText'>Title</div>");//inserts the text "Title" into the DOM
				$("#searchResults").append("<div class ='bookTitle'>"+_response.items[i].volumeInfo.title+"</div>");//fetches the title from the GET request and inserts in the DOM
				$("#searchResults").append("<div class ='bookAuthorText'>Author</div>");//inserts the text "Author" into the DOM
				$("#searchResults").append("<div class ='bookAuthor'>"+_response.items[i].volumeInfo.authors+"</div>");//fetches the Author from the GET request and inserts in the DOM
				$("#searchResults").append("<div class ='bookPublishText '>Published:</div>");//inserts the text "Published Date" into the DOM
				$("#searchResults").append("<div class ='bookPublish'>"+_response.items[i].volumeInfo.publishedDate+"</div>");//fetches the Puslished Date from the GET request and inserts in the DOM
			}
} //displayResults

//function that cleans the total results text
function cleanTotalResults(){
	$("#searchResultsText").empty();
}

//function that cleans the interface in order to display new Books data
function cleanBooks(){
	$("#searchResults").empty();
}	

//function that cleans the variables for a new search.
function cleanData(){
	_searchText ="";
	_searchType=""; 
	_startIndex = 0;
	_previousIndex = 0;
}

}); //Document ready
	
