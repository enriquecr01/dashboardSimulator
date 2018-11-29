<?php
  class MySqlServerConnection
  {
    private $connection;

    private $user = 'root';//change user
    private $password = '';//change password


    function __construct()
    {
      try {

        $this->connection = new PDO('mysql:host=localhost;dbname=rfood;charset=utf8', $this->user, $this->password);//change host and bd

      } catch (PDOException $e) {
        echo "Error ".$e->getMessage();
      }
    }

    public function executeQuery($sql, $params)
    {
      $stmt = $this->connection->prepare($sql);
      if ($stmt === false) {
        echo "Error in Query ".$sql;
        die();
      }
      $stmt->execute($params);
      $data = $stmt->fetchAll();
      return $data;
    }

    public function executeNonQuery($sql, $params)
    {
      $stmt = $this->connection->prepare($sql);
      if ($stmt === false) {
        echo "Error in Query ".$sql;
        die();
      }
      $stmt->execute($params);
      $id = $this->connection->lastInsertId();
      return $id;
    }

    public function executeNonQueryWithReturn($sql, $params)
    {
      $stmt = $this->connection->prepare($sql);
      if ($stmt === false) {
        echo "Error in Query ".$sql;
        die();
      }
      $status = $stmt->execute($params);
      return $status;
      // $id = $this->connection->lastInsertId();
      // return $id;
    }

    public function executeScript($sql)
    {
      $stmt =$this->connection->exec($sql);
      if ($stmt === false) {
        echo "Error in Query ".$sql;
        die();
      }
    }

    public function close()
    {
      $this->connection = null;
    }

    public function executeQueryNew($sql, $params)
    {

      // Prepate Paramterized query
      $stmt = $this->connection->prepare($sql);

      // Execute the Query
      $stmt->execute($params);

      // Hanndling Errors
      if ( $stmt->execute($params) == FALSE ) {

        // Display Error Message
        die("Error: ".print_r($stmt->errorInfo()) );

      }
      // End hendling Errors

      // Get Query Result
      $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);

      // Return Query values
      return $data;
    }


  }
?>
