<?php
/**
 * Class to handle all db operations
 */
class DbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }


    /**
     * Creating new user
     * @param String $login User full login
     * @param String $email User login email id
     * @param String $password User login password
     * @return Success or type of error
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
     * @return boolean :true if user already exist
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
     * @return User if found
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
     * Fetching user id by api key
     * @param String $api_key user api key
     * @return $user_id
     */
    public function getUserId($api_key) {
        $stmt = $this->conn->prepare("SELECT ID FROM keedo_users WHERE api_key = ?");
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
     * @return boolean : true is key is valid
     */
    public function isValidApiKey($api_key) {
        $stmt = $this->conn->prepare("SELECT ID from keedo_users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
         * Updating user information
         * @param String $login is user login
         * @param String $email is user email
         * @param String $password is user pass
         * @param String $api_key is corresponding key to user
         * @return boolean : True if any of the arguments is incorrect
         */
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
        if($login != NULL and $password != NULL and $email != NULL){
         return TRUE;
         }else{
         return FALSE;
         }
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
     * @param Integer $userID is the ID associate to user
     * @param Double $price is the price of book
     * @param String $bookcondition is the condition of book
     * @param String $title is the title of book
     * @param String $picture is link of thumbnails of book
     * @return boolean : true is successfully sold
     */
    public function sellBook($ISBN,$module,$userID,$price,$bookcondition, $title, $author, $picture) {
        $stmt = $this->conn->prepare("INSERT INTO keedo_books(ISBN,module,title,author,picture) VALUES (?,?,?,?,?)");
        $stmt->bind_param("sisss",$ISBN, $module, $title, $author, $picture);
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
    /**
     * Associating a user with a book
     * @param String $ISBN is ID of the book
     * @param String $modules is the subject (computing/sciences/law/etc..)
     * @param Double $price is the price of book
     * @param String $bookcondition is the condition of book
     * @return boolean : true if request is done
     */
    public function addOwner($ISBN,$userID,$price,$bookcondition) {
            $stmt = $this->conn->prepare("INSERT INTO keedo_books_own (ISBN,user,price,bookcondition) VALUES (?,?,?,?)");
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
         * @param String $ISBN is ISBN of the book
         * @return $books
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
     * Fetching books all books in database
     * @return $books
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
     * @param String $id is associating id of the book
     * @return books
     */
    public function getBookByModule($id) {
        $stmt = $this->conn->prepare("SELECT * FROM keedo_books kb1, keedo_books_own kdo WHERE kdo.ISBN IN (SELECT ISBN FROM keedo_books kb WHERE module=? AND kdo.ISBN=kb.ISBN);");
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $books = $stmt->get_result();
        $stmt->close();
        return $books;
      }

    /**
     * Fetching all the modules
     * @return modules
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
        $stmt = $this->conn->prepare("SELECT keedo_books_own.ISBN, keedo_users.login, keedo_books_own.bookCondition, keedo_books_own.price FROM keedo_books_own, keedo_users WHERE keedo_books_own.user = ? AND keedo_users.ID =  keedo_books_own.user");
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
    public function buyBook($ISBN,$module,$sellerID,$buyerID,$bookcondition,$price,$status){

        //not implemented due to client specification (no need to have payment at this point)

               return TRUE;
      }



    /**
    * Remove book an available during a transaction
    * @param String $ISBN is ISBN of book
    * @param Integer $sellerID is id of the seller
    * @return boolean : True if query is successfully done
    */
    public function deleteAvailableBook($ISBN,$sellerID){
          $stmt = $this->conn->prepare("DELETE FROM keedo_books_own WHERE ISBN=? AND user=?");
          $stmt->bind_param("si", $ISBN, $sellerID);
          if($stmt->execute()){
              return TRUE;
          }else{
              return FALSE;
          }
          $stmt->close();
    }

}
