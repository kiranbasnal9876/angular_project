<?php
defined('BASEPATH') or exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Jwt_token
{
    private $secret_key = "k-user@-n295"; 

    public function __construct()
    {
        log_message('debug', 'JWT Library Initialized');
    }

    public function generate_token($user_data)
    {
        $issued_at = time();
        $expiration_time = $issued_at + (60 * 60*24 ); 

        $payload = [
            'iss' => base_url(),
            'iat' => $issued_at,
            'exp' => $expiration_time,
            'data' => $user_data
        ];

        return JWT::encode($payload, $this->secret_key, 'HS256');
    }

    public function get_verified_token()
    {
        $CI = &get_instance();
        $authHeader = $CI->input->get_request_header('authorization');
    
        if (!$authHeader) {
            echo json_encode(['error' => 'Access denied, token required']);
            exit;
        }
    
        $token = str_replace('Bearer ', '', trim($authHeader));
    
        if (empty($token)) {
            echo json_encode(['error' => 'Token is empty']);
            exit;
        }
    
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, 'HS256'));
            return $decoded->data[0]; 
        } catch (Exception $e) {
            echo json_encode(['error' => 'Invalid token: ' . $e->getMessage()]);
            exit;
        }
    }
    
    
}
