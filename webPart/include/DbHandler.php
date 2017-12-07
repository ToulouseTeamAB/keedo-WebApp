<?php
/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class DbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }

    /* ------------- `users` table method ------------------ */

    /**
     * Creating new user
     * @param String $login User full login
     * @param String $email User login email id
     * @param String $password User login password
     */
    public function createUser($login, $email, $password) {
        require_once 'PassHash.php';
        $response = array();

        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // Generating password hash
            $pass = PassHash::hash($password);

            // Generating API key
            $api_key = $this->generateApiKey();

            // insert query
            $stmt = $this->conn->prepare("INSERT INTO keedo_users(login, email, pass, api_key, status) values(?, ?, ?, ?, 1)");
            $stmt->bind_param("ssss", $login, $email, $pass, $api_key);

            $result = $stmt->execute();

            $stmt->close();

            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                return USER_CREATED_SUCCESSFULLY;
            } else {
                // Failed to create user
                return USER_CREATE_FAILED;
            }
        } else {
            // User with same email already existed in the db
            return USER_ALREADY_EXISTED;
        }

        return $response;
    }

    /**
     * Checking user login
     * @param String $email User login email id
     * @param String $password User login password
     * @return boolean User login status success/fail
     */
    public function checkLogin($email, $password) {
        // fetching user by email
        $stmt = $this->conn->prepare("SELECT pass FROM keedo_users WHERE email = ?");

        $stmt->bind_param("s", $email);

        $stmt->execute();

        $stmt->bind_result($pass);

        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Found user with the email
            // Now verify the password

            $stmt->fetch();

            $stmt->close();

            if (PassHash::check_password($pass, $password)) {
                // User password is correct
                return TRUE;
            } else {
                // user password is incorrect
                return FALSE;
            }
        } else {
            $stmt->close();

            // user not existed with the email
            return FALSE;
        }
    }

    /**
     * Checking for duplicate user by email address
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($email) {
        $stmt = $this->conn->prepare("SELECT id from keedo_users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }


    /**
     * Fetching user by email
     * @param String $email User email id
     */
    public function getUserByEmail($email) {
        $stmt = $this->conn->prepare("SELECT ID,login, email, api_key, status, registered FROM keedo_users WHERE email = ?");
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($id,$login, $email, $api_key, $status, $registered);
            $stmt->fetch();
            $user = array();
            $user["id"] = $id;
            $user["login"] = $login;
            $user["email"] = $email;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["registered"] = $registered;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user api key
     * @param String $user_id user id primary key in user table
     */
    public function getApiKeyById($user_id) {
        $stmt = $this->conn->prepare("SELECT api_key FROM keedo_users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            // $api_key = $stmt->get_result()->fetch_assoc();
            // TODO
            $stmt->bind_result($api_key);
            $stmt->close();
            return $api_key;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    public function getUserId($api_key) {
        $stmt = $this->conn->prepare("SELECT id FROM keedo_users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        if ($stmt->execute()) {
            $stmt->bind_result($user_id);
            $stmt->fetch();
            $stmt->close();
            return $user_id;
        } else {
            return NULL;
        }
    }

    /**
     * Validating user api key
     * If the api key is there in db, it is a valid key
     * @param String $api_key user api key
     * @return boolean
     */
    public function isValidApiKey($api_key) {
        $stmt = $this->conn->prepare("SELECT id from keedo_users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function updateUser($login, $email, $password, $api_key){
        require_once 'PassHash.php';
        if($login != NULL){
            $stmt = $this->conn->prepare("UPDATE keedo_users SET login = ? where api_key = ?");
            $stmt->bind_param("ss",$login, $api_key);
            $stmt->execute();
            $stmt->close();
        }
        if($password != NULL){
            $pass = PassHash::hash($password);
            $stmt = $this->conn->prepare("UPDATE keedo_users SET pass=? where api_key = ?");
            $stmt->bind_param('ss',$pass, $api_key);
            $stmt->execute();
            $stmt->close();
        }
        if($email != NULL){
            $stmt = $this->conn->prepare("UPDATE keedo_users SET email=? where api_key = ?");
            $stmt->bind_param('ss',$email, $api_key);
            $stmt->execute();
            $stmt->close();
        }
        return TRUE;
    }

      /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }


    /**
     * Adding a new book available in database
     * @param String $ISBN is ID of the book
     * @param String $modules is the subject (computing/sciences/law/etc..)
     */
    public function sellBook($ISBN,$modules,$userID,$price,$bookcondition, $title, $author, $picture) {
        $stmt = $this->conn->prepare("INSERT INTO keedo_books(ISBN,modules,title,author,picture) VALUES (?,?,?,?,?)");
        $stmt->bind_param("sisss",$ISBN, $modules, $title, $author, $picture);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            // successfully added to the db
           $res = $this -> addOwner($ISBN,$userID,$price,$bookcondition);
           if ($res){
              return $res;
            }
        } else {
            // add failed
            return NULL;
          }
    }

    public function addOwner($ISBN,$userID,$price,$bookcondition) {
            $stmt = $this->conn->prepare("INSERT INTO keedo_books_own (ISBN,ID,price,bookcondition) VALUES (?,?,?,?)");
            $stmt->bind_param("sids",$ISBN, $userID, $price, $bookcondition);
            $result = $stmt->execute();

           if ($result === false) {
                       die('execute() failed: ' . htmlspecialchars($stmt->error));
           }
              $stmt->close();
              return $result;
     }


    /**
         * Fetching single book by ISBN
         * @param String $task_id id of the task
         */
        public function getBookByISBN($ISBN) {
            $stmt = $this->conn->prepare("SELECT kbo.* FROM keedo_books kb, keedo_books_own kbo WHERE kbo.ISBN = ? AND kb.ISBN=kbo.ISBN");
            $stmt->bind_param("s",$ISBN);
            if ($stmt->execute()) {
                 $books = $stmt->get_result();
                 $stmt->close();
                 return $books;
            } else {
                  return NULL;
              }
          }
/**
         * Fetching single book by author
         * @param String $task_id id of the task
         */
        public function getBookByAuthor($ISBN) {
            //TODO

          }
    /**
     * Fetching books by module
     * @param String $task_id id of the task
     */
    public function getAllBook() {
        $stmt = $this->conn->prepare("SELECT * FROM keedo_books_own kdo WHERE ISBN IN (SELECT ISBN FROM keedo_books kb WHERE kdo.ISBN=kb.ISBN)");
        $stmt->execute();
        $books = $stmt->get_result();
        $stmt->close();
        return $books;
      }

    /**
     * Fetching books by module
     * @param String $task_id id of the task
     */
    public function getBookByModule($id) {
        $stmt = $this->conn->prepare("SELECT * FROM keedo_books kb1, keedo_books_own kdo WHERE kdo.ISBN IN (SELECT ISBN FROM keedo_books kb WHERE modules=? AND kdo.ISBN=kb.ISBN);");
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $books = $stmt->get_result();
        $stmt->close();
        return $books;
      }

    /**
     * Fetching all the modules
     * @param String $task_id id of the task
     */
    public function getAllModule() {
        $stmt = $this->conn->prepare("SELECT * FROM keedo_books_modules");
        $stmt->execute();
        $modules = $stmt->get_result();
        $stmt->close();
        return $modules;
      }

    /**
     * Check if book is in database
     * @param String $codeISBN Book ISBN
     * @return boolean if the book is in the database
     */
    public function checkBookInDatabase($codeISBN) {
        $stmt = $this->conn->prepare("SELECT ISBN FROM keedo_books WHERE keedo_books.ISBN = ?");
        $stmt->bind_param("s", $codeISBN);
        $stmt->execute();
        $ISBNReturn = $stmt->get_result();
        if ($ISBNReturn->num_rows == 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * get buy log for user
     * @param String $idUser User ID
     * @return array for the user
     */
    public function getBuyLog($idUser) {
        $stmt = $this->conn->prepare("SELECT keedo_books_selling.ISBN, keedo_users.login, keedo_books_selling.bookCondition, keedo_books_selling.price, keedo_books_selling.status FROM keedo_books_selling, keedo_users WHERE keedo_books_selling.buyerID = ? AND keedo_users.ID =  keedo_books_selling.buyerID");
        $stmt->bind_param("i", $idUser);
        $stmt->execute();
        $ISBNReturn = $stmt->get_result();
        $stmt->close();
        return $ISBNReturn;
    }

    /**
     * get sell log for user
     * @param String $idUser User ID
     * @return array for the user
     */
    public function getSellLog($idUser) {
        $stmt = $this->conn->prepare("SELECT keedo_books_selling.ISBN, keedo_users.login, keedo_books_selling.bookCondition, keedo_books_selling.price, keedo_books_selling.status FROM keedo_books_selling, keedo_users WHERE keedo_books_selling.sellerID = ? AND keedo_users.ID =  keedo_books_selling.sellerID");
        $stmt->bind_param("i", $idUser);
        $stmt->execute();
        $ISBNReturn = $stmt->get_result();
        $stmt->close();
        return $ISBNReturn;
    }

    /**
     * get advert for user
     * @param String $idUser User ID
     * @return array for the user
     */
    public function getAdvertLog($idUser) {
        $stmt = $this->conn->prepare("SELECT keedo_books_own.ISBN, keedo_users.login, keedo_books_own.bookCondition, keedo_books_own.price FROM keedo_books_own, keedo_users WHERE keedo_books_own.ID = ? AND keedo_users.ID =  keedo_books_own.ID");
        $stmt->bind_param("i", $idUser);
        $stmt->execute();
        $ISBNReturn = $stmt->get_result();
        $stmt->close();
        return $ISBNReturn;
    }

public function buyBook($ISBN,$modules,$sellerID,$buyerID,$bookcondition,$price,$status){


              /* //INSERT INTO keedo_books_selling
               $stmt = $this->conn->prepare("INSERT INTO keedo_books_selling(ISBN, sellerID, buyerID, bookCondition, price, status) VALUES (?,?,?,?,?,?)");
               $stmt->bind_param("siisds",$ISBN,$sellerID,$buyerID,$bookcondition,$price,$status);
               $add=$stmt->execute();
               $stmt->close();

               if($add =! NULL){
                    //COUNT to check the number of book of this ISBN
                    $count = $this->checkBookInDatabase($ISBN);
                    //Delete the book
                    $res=$this->deleteAvailableBook($ISBN,$sellerID);
                    //If last book delete ISBN from keedo_books
                    if($count==1){
                        $stmt2= $this->conn->prepare("DELETE FROM keedo_books WHERE ISBN=?");
                        $stmt2->bind_param("s",$ISBN);
                        $stmt2->execute();
                        $stmt2->close();
                    }
                    $stmt = $this->conn->prepare("SELECT * FROM keedo_books_selling WHERE ISBN=? AND sellerID=? AND buyerID=?");
                    $stmt->bind_param("sii",$ISBN,$sellerID,buyerID);
                    $book=$stmt->execute();
                    return $book;
               } else {
                    return FALSE;
               }*/
               return TRUE;
      }



    /**
    * Move available book in the sold books
    * @param String
    */
    public function deleteAvailableBook($ISBN,$sellerID){
          $stmt = $this->conn->prepare("DELETE FROM keedo_books_own WHERE ISBN=? AND ID=?");
          $stmt->bind_param("si", $ISBN, $sellerID);
          if($stmt->execute()){
              return TRUE;
          }else{
              return FALSE;
          }
          $stmt->close();
    }


    /**
     * Updating task
     * @param String $task_id id of the task
     * @param String $task task text
     * @param String $status task status
     */
    public function updateTask($user_id, $task_id, $task, $status) {
        $stmt = $this->conn->prepare("UPDATE tasks t, user_tasks ut set t.task = ?, t.status = ? WHERE t.id = ? AND t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("siii", $task, $status, $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /**
     * Deleting a task
     * @param String $task_id id of the task to delete
     */
    public function deleteTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("DELETE t FROM tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /* ------------- `user_tasks` table method ------------------ */

    /**
     * Function to assign a task to user
     * @param String $user_id id of the user
     * @param String $task_id id of the task
     */
    public function createUserTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("INSERT INTO user_tasks(user_id, task_id) values(?, ?)");
        $stmt->bind_param("ii", $user_id, $task_id);
        $result = $stmt->execute();

        if (false === $result) {
            die('execute() failed: ' . htmlspecialchars($stmt->error));
        }
        $stmt->close();
        return $result;
    }

}
