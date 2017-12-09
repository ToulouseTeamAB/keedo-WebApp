<?php

require '.././libs/Slim/Http/Request.php';
require_once '../include/DbHandler.php';
require_once '../include/PassHash.php';
require '.././libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;

/**
 * Adding Middle Layer to authenticate every request
 * Checking if the request has valid api key in the 'Authorization' header
 */
function authenticate(\Slim\Route $route) {
    // Getting request headers
    $headers = apache_request_headers();
    $response = array();
    $app = \Slim\Slim::getInstance();

    // Verifying Authorization Header
    if (isset($headers['Authorization'])) {
        $db = new DbHandler();

        // get the api key
        $api_key = $headers['Authorization'];
        // validating api key
        if (!$db->isValidApiKey($api_key)) {
            // api key is not present in users table
            $response["error"] = true;
            $response["message"] = "Access Denied. Invalid Api key";
            echoResponse(401, $response);
            $app->stop();
        } else {
            global $user_id;
            // get user primary key id
            $user_id = $db->getUserId($api_key);
        }
    } else {
        // api key is missing in header
        $response["error"] = true;
        $response["message"] = "Api key is misssing";
        echoResponse(400, $response);
        $app->stop();
    }
}

/**
 * ----------- METHODS WITHOUT AUTHENTICATION ---------------------------------
 */
/**
 * User Registration
 * url - /register
 * method - POST
 * params - login, email, password
 */

$app->post('/register', function() use ($app) {
            $register = json_decode($app->request()->getBody(),true);
            $response = array();
            // reading post params
            $login = $register['login'];
            $email = $register['email'];
            $password = $register['password'];

            // check for correct email and password
            error_log("1->email: ".$email.">password:".$password);

            // validating email address
            validateEmail($email);

            $db = new DbHandler();
            $res = $db->createUser($login, $email, $password);

            if ($res == USER_CREATED_SUCCESSFULLY) {
                $response["error"] = false;
                $response["message"] = "You are successfully registered";
            } else if ($res == USER_CREATE_FAILED) {
                $response["error"] = true;
                $response["message"] = "Oops! An error occurred while registereing";
            } else if ($res == USER_ALREADY_EXISTED) {
                $response["error"] = true;
                $response["message"] = "Sorry, this email already existed";
            }
            // echo json response
            echoResponse(201, $response);
        });

/**
 * User Login
 * url - /login
 * method - POST
 * params - email, password
 */
$app->post('/login', function() use ($app) {

            $login = json_decode($app->request()->getBody(),true);
            // reading post params
            $email = $login['email'];
            $password = $login['password'];
            $response = array();



            $db = new DbHandler();
            // check for correct email and password
            error_log("2->email: ".$email.">password:".$password);

            if ($db->checkLogin($email, $password)) {
                // get the user by email
                $user = $db->getUserByEmail($email);

                if ($user != NULL) {
                    $response["error"] = false;
                    $response['id'] = $user['ID'];
                    $response['login'] = $user['login'];
                    $response['email'] = $user['email'];
                    $response['apiKey'] = $user['api_key'];
                    $response['registered'] = $user['registered'];

                } else {
                    // unknown error occurred
                    $response['error'] = true;
                    $response['message'] = "An error occurred. Please try again";
                }
            } else {
                // user credentials are wrong
                $response['error'] = true;
                $response['message'] = 'Login failed. Incorrect credentials';
            }

            echoResponse(200,$response);

        });

$app->post('/updateuser', 'authenticate', function() use ($app) {
    $data = json_decode($app->request()->getBody(),true);
    // reading post params
    $login = NULL;
    $email = NULL;
    $password = NULL;

    $response = array();

    if(isset($data['login'])){
        $login = $data['login'];
    }
    if(isset($data['email'])){
        $email = $data['email'];
    }
    if(isset($data['pass'])){
        $password = $data['pass'];
    }

    $db = new DbHandler();
    $headers = apache_request_headers();
    $api_key = $headers['Authorization'];

    if ($db->updateUser($login,$email,$password, $api_key)){
        $response['error'] = false;
    } else {
        // user credentials are wrong
        $response['error'] = true;
        $response['message'] = 'An error occurred. Please try again';
    }

    echoResponse(200,$response);

});

$app->options('/login', function() use ($app) {
    error_log("options for login");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: application/json');
    die();
});

$app->options('/register', function() use ($app) {
    error_log("options for register");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: application/json');
    die();
});

$app->options('/updateuser', function() use ($app) {
    error_log("options for update user");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type, Authorization');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: application/json');
    die();
});

$app->options('/sellbook', function() use ($app) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type, Authorization');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: application/json');
    die();
});

$app->options('/getLog', function() use ($app) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type, Authorization');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: application/json');
    die();
});

$app->get('/books', function(){
            $response = array();
            $db = new DbHandler();

            $result = $db->getAllBook();

            if($result != NULL){
                  $response["error"] = false;
                  $response["books"] = array();

                  // looping through result and preparing tasks array
                   while ($books = $result->fetch_assoc()) {
                           $tmp = array();
                           $tmp["ISBN"] = $books["ISBN"];
                           $tmp["sellerID"] = $books["ID"];
                           $tmp["price"] = $books["price"];
                           $tmp["condition"] = $books["bookcondition"];
                           array_push($response["books"], $tmp);
                   }
            }else{
                  $response["error"] = false;
                  $response["message"] = "No book found";
            }
            echoResponse(201,$response);
});

$app->get('/books/:ISBN', function($ISBN){
            $response = array();
            $db = new DbHandler();

            $result = $db->getBookByISBN($ISBN);

            if($result != NULL){
                  $response["error"] = false;
                  $response["books"] = array();

                  // looping through result and preparing tasks array
                   while ($books = $result->fetch_assoc()) {
                           $tmp = array();
                           $tmp["ISBN"] = $books["ISBN"];
                           $tmp["sellerID"] = $books["ID"];
                           $tmp["price"] = $books["price"];
                           $tmp["condition"] = $books["bookcondition"];
                           array_push($response["books"], $tmp);
                   }
            }else{
                  $response["error"] = false;
                  $response["message"] = "No book found";
            }
            echoResponse(201,$response);
});

//TODO Add filter
/**
 * Search books info by name
 * method GET
 * url /searchbook
 */
$app->get('/search', function() use ($app) {

    $bookName = $app->request()->get('bookName');
    $db = new DbHandler();

    $googleQuery = "https://www.googleapis.com/books/v1/volumes?q=" . $bookName."&country=UK&maxResults=10";
    $googleQuery = str_replace(' ', '%20', $googleQuery);
    $resultQuery = file_get_contents($googleQuery);
    $decodeQuery = json_decode($resultQuery, true);
    $tableISBN = array();
    foreach ($decodeQuery['items'] as $value) {
        $temp = array();
        $temp["title"] = $value['volumeInfo']["title"];

        $temp["author"] = "";
        if(isset($value['volumeInfo']['authors'])) {
            foreach ($value['volumeInfo']['authors'] as $author) {
                if ($temp["author"] != "") {
                    $temp["author"] .= ", ";
                }
                $temp["author"] .= $author;
            }
        }else{
            $temp["author"] = "no author";
        }

        $validBook = FALSE;
        $temp["ISBN"] = "";
        if(isset($value['volumeInfo']['industryIdentifiers'])) {
            foreach ($value['volumeInfo']['industryIdentifiers'] as $ISBN) {
                if ($ISBN['type'] == "ISBN_13") {
                    $temp["ISBN"] = $ISBN['identifier'];
                    $validBook = TRUE;
                }
            }
        }

        if(isset($value['volumeInfo']['imageLinks']['thumbnail'])){
            $temp["picture"] = $value['volumeInfo']['imageLinks']['thumbnail'];
        }else{
            $temp["picture"] = "http://csdm-lamp.comp.rgu.ac.uk/~ToulouseTeam/img/noCoverAvailable.jpg";
        }

        if($validBook) {
            $temp['inDB'] = $db->checkBookInDatabase($temp["ISBN"]);
            array_push($tableISBN, $temp);
        }
    }
    //echo json_encode($tableISBN,JSON_UNESCAPED_SLASHES);
    echoResponse(200, $tableISBN);
});

/**
 * Listing all tasks of particual user
 * method GET
 * url /book
 */
$app->get('/modules', function() {
            $response = array();
            $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getAllModule();

            $response["error"] = false;
            $response["modules"] = array();

            // looping through result and preparing tasks array
            while ($modules = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["id"] = $modules["ID"];
                $tmp["label"] = $modules["label"];
                array_push($response["modules"], $tmp);
            }

            echoResponse(200, $response);
        });

        /**
         * Listing all tasks of particual user
         * method GET
         * url /book
         */
        $app->get('/modules/:id', function($id) {
                    $response = array();
                    $db = new DbHandler();

                    // fetching all user tasks
                    $result = $db->getBookByModule($id);
                    $response["error"] = false;
                    $response["books"] = array();

                    // looping through result and preparing tasks array
                    while ($books = $result->fetch_assoc()) {
                        $tmp = array();
                        $tmp["ISBN"] = $books["ISBN"];
                        $tmp["ID"] = $books["ID"];
                        $tmp["price"] = $books["price"];
                        $tmp["bookcondition"] = $books["bookcondition"];
                        $tmp["title"] = $books["title"];
                        $tmp["author"] = $books["author"];
                        $tmp["picture"] = $books["picture"];

                        array_push($response["books"], $tmp);
                    }

                    echoResponse(200, $response);
                });
/*
 * ------------------------ METHODS WITH AUTHENTICATION ------------------------
 */

/**
 * getLog for a user
 * method GET
 * url /getLog
 */
$app->get('/getLog', 'authenticate', function() use ($app) {
    $userID = $app->request()->get('id');
    $db = new DbHandler();

    $tempBuy = $db->getBuyLog($userID);
    $tempSell = $db->getSellLog($userID);
    $tempAd = $db->getAdvertLog($userID);
    $result['buy'] = array();
    $result['sell'] = array();

    while ($recup = $tempBuy->fetch_assoc()) {
        $test = convertLogRequest($recup);
        array_push($result['buy'], $test);
    }

    while ($recup = $tempSell->fetch_assoc()) {
        $test = convertLogRequest($recup);
        array_push($result['sell'], $test);
    }

    while ($recup = $tempAd->fetch_assoc()) {
        $test = array();
        $test['ISBN'] = $recup['ISBN'];
        $test['login'] = $recup['login'];
        $test['bookCondition'] = $recup['bookCondition'];
        $test['price'] = $recup['price'];
        $test['status'] = "On sale";
        array_push($result['sell'], $test);
    }

    echoResponse(200,$result);

});


/**
 * Listing all tasks of particual user
 * method GET
 * url /book
 */
$app->get('/tasks', 'authenticate', function() {
            global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getAllUserTasks($user_id);

            $response["error"] = false;
            $response["tasks"] = array();

            // looping through result and preparing tasks array
            while ($task = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["id"] = $task["ID"];
                $tmp["task"] = $task["task"];
                $tmp["status"] = $task["status"];
                $tmp["registered"] = $task["registered"];
                array_push($response["tasks"], $tmp);
            }

            echoResponse(200, $response);
        });

/**
 * Listing single task of particual user
 * method GET
 * url /tasks/:id
 * Will return 404 if the task doesn't belongs to user
 */
$app->get('/tasks/:id', 'authenticate', function($task_id) {
            global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetch task
            $result = $db->getTask($task_id, $user_id);

            if ($result != NULL) {
                $response["error"] = false;
                $response["id"] = $result["ID"];
                $response["task"] = $result["task"];
                $response["status"] = $result["status"];
                $response["registered"] = $result["registered"];
                echoResponse(200, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "The requested resource doesn't exists";
                echoResponse(404, $response);
            }
        });

/**
 * Creating new book in db
 * method POST
 * params - login
 * url - /book/
 */
$app->post('/buybook', 'authenticate', function() use ($app){

            $db = new DbHandler();
            $book = array();
            // reading post params
            $book = json_decode($app->request()->getBody(),true);

            $ISBN = $book['ISBN'];
            $modules = $book['modules'];
            $sellerID = $book['sellerID'];
            $buyerID = $book['buyerID'];
            $price = $book['price'];
            $bookcondition = $book['bookCondition'];
            $status = $book['status'];


            // creating new task
            $req = $db->buyBook($ISBN,$modules,$sellerID,$buyerID,$bookcondition,$price,$status);

            if ($req == TRUE) {
                $response["error"] = false;
                $response["message"] = "Succesfully bought";
                /*$response["ISBN"] = $req['ISBN'];
                $response["modules"] = $req['modules'];
                /*$response["sellerID"] =  $sellerID;
                $response["buyerID"] = $buyerID;
                $response["price"] = $price;
                $response["bookcondition"] = $bookcondition;
                $response["status"] = $status;*/
                echoResponse(201, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "You can't buy this book. An error occured";
                echoResponse(200, $response);
            }
        });

/**
 * Creating new book in db
 * method POST
 * params - login
 * url - /book/
 */
$app->post('/sellbook', 'authenticate', function() use ($app){

            $db = new DbHandler();
            // reading post params
            $book = json_decode($app->request()->getBody(),true);

            $ISBN = $book['ISBN'];
            $modules = $book['modules'];
            $userID = $book['userID'];
            $price = $book['price'];
            $title = NULL;
            $author = NULL;
            $picture = NULL;
            if(isset($book['title'])){
                $title = $book['title'];
            }
            if(isset($book['author'])){
                $author = $book['author'];
            }
            if(isset($book['picture'])){
                $picture = $book['picture'];
            }

            $bookcondition = $book['bookcondition'];


            // creating new task
            $req = $db->sellbook($ISBN,$modules,$userID,$price,$bookcondition,$title,$author,$picture);

            if ($req != NULL) {
                $response["error"] = false;
                $response["message"] = "Book added successfully";
                $response["ISBN"] = $ISBN;
                echoResponse(201, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "Can't add this book. Please try again";
                echoResponse(200, $response);
            }
        });



/**
 * Updating existing task
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/tasks/:id', 'authenticate', function($task_id) use($app) {
            // check for required params
            verifyRequiredParams(array('task', 'status'));

            global $user_id;
            $task = $app->request->put('task');
            $status = $app->request->put('status');

            $db = new DbHandler();
            $response = array();

            // updating task
            $result = $db->updateTask($user_id, $task_id, $task, $status);
            if ($result) {
                // task updated successfully
                $response["error"] = false;
                $response["message"] = "Task updated successfully";
            } else {
                // task failed to update
                $response["error"] = true;
                $response["message"] = "Task failed to update. Please try again!";
            }
            echoResponse(200, $response);
        });

/**
 * Deleting task. Users can delete only their tasks
 * method DELETE
 * url /tasks
 */
$app->delete('/tasks/:id', 'authenticate', function($task_id) use($app) {
            global $user_id;

            $db = new DbHandler();
            $response = array();
            $result = $db->deleteTask($user_id, $task_id);
            if ($result) {
                // task deleted successfully
                $response["error"] = false;
                $response["message"] = "Task deleted succesfully";
            } else {
                // task failed to delete
                $response["error"] = true;
                $response["message"] = "Task failed to delete. Please try again!";
            }
            echoResponse(200, $response);
        });

/**
 * Verifying required params posted or not
 */
function verifyRequiredParams($required_fields) {
    $error = false;
    $error_fields = "";
    $request_params = array();
    $request_params = $_REQUEST;
    // Handling PUT request params
    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $app = \Slim\Slim::getInstance();
        parse_str($app->request()->getBody(), $request_params);
    }
    foreach ($required_fields as $field) {
        if (!isset($request_params[$field]) || strlen(trim($request_params[$field])) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        // Required field(s) are missing or empty
        // echo error json and stop the app
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["error"] = true;
        $response["message"] = 'Required field(s) ' . substr($error_fields, 0, -2) . ' is missing or empty';
        echoResponse(400, $response);
        $app->stop();
    }
}

/**
 * Validating email address
 */
function validateEmail($email) {
    $app = \Slim\Slim::getInstance();
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["error"] = true;
        $response["message"] = 'Email address is not valid';
        echoResponse(400, $response);
        $app->stop();
    }
}

/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoResponse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->controlOrigin('*');
    $app->controlContentType('Content-Type');
    $app->contentType('application/json');

    echo json_encode($response, JSON_UNESCAPED_SLASHES);
}

/**
 * @param $recup
 * @return array
 */
function convertLogRequest($recup)
{
    $test = array();
    $test['ISBN'] = $recup['ISBN'];
    $test['login'] = $recup['login'];
    $test['bookCondition'] = $recup['bookCondition'];
    $test['price'] = $recup['price'];
    $test['status'] = $recup['status'];
    return $test;
}

$app->run();
