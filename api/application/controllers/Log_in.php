<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Log_in extends CI_Controller
{

  public function __construct() {
    parent::__construct();
   
    $this->load->model('log_inModel');
  }
  
  
  function index()
  {
    $_POST = json_decode(file_get_contents('php://input'), true);

    $email = $_POST['email'];
    $password = $_POST['password'];

    $data = $this->log_inModel->loggin_user($email, $password);


    if ($data == []){
      
      echo  json_encode(['error' => "you can't logging"]);
      return;
    } 
    else {
      $token= $this->jwt_token->generate_token($data);
      echo  json_encode(['user_data' => $token]);
      return;
    }
   
 
  }
    
  }

 


