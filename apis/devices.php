<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET');
	require_once('connection.php');

      $hours = array("01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
                        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
                        "23:00");

      $hours59 = array("01:59", "02:59", "03:59", "04:59", "05:59", "06:59", "07:59", "08:59", "09:59", "10:59", "11:59",
                        "12:59", "13:59", "14:59", "15:59", "16:59", "17:59", "18:59", "19:59", "20:59", "21:59", "22:59",
                        "23:59");

	if ($_SERVER['REQUEST_METHOD'] == 'GET') 
	{
		if (isset($_GET['idMac']) && isset($_GET['type'])) 
		{
      		$connection = new MySqlServerConnection();
                  date_default_timezone_set('America/Tijuana');
                  $i = 0;
                  $today = date("Y-m-d");
                  $readingDuck = array();
                  $readingContainer = array();

                  if ($_GET['type'] == 1) 
                  {
                        while ($i <= 22) 
                        {
                              $query = 'SELECT SUM(quantity) as result
                                    FROM container
                                    WHERE idMac = ? AND time >= ? AND time <= ? AND date = ?';
                              $result = $connection->executeQuery($query, array($_GET['idMac'], $hours[$i], $hours59[$i], $today));

                              if(isset($result[0][0])) { }
                              else { $result[0][0] = 0; }


                              $container = array(
                                    "bethours" => $hours[$i]." - ".$hours59[$i],
                                    "total" => $result[0][0]
                              );
                              array_push($readingContainer, $container);
                              $i++;
                        }     
                  }
                  else
                  {
                        while ($i <= 22) 
                        {

                              $query = 'SELECT SUM(weight) as result
                                    FROM duckfoodhistory
                                    WHERE idMac = ? AND time >= ? AND time <= ? AND date = ?';
                              $result = $connection->executeQuery($query, array($_GET['idMac'], $hours[$i], $hours59[$i], $today));

                              if(isset($result[0][0])) { }
                              else { $result[0][0] = 0; }

                              $duck = array(
                                    "bethours" => $hours[$i]." - ".$hours59[$i],
                                    "total" => $result[0][0]
                              );
                              array_push($readingDuck, $duck);
                              $i++;
                        }
                  }

                  $query = 'SELECT idMac, description, ipAddress, totalLifeCans
                              FROM devices
                              WHERE idMac = ?';
                  $result = $connection->executeQuery($query, array($_GET['idMac']));

                  if ($_GET['type'] == 1) 
                  {
                        $device = array(
                              'idMac' => $result[0][0],
                              'description' => $result[0][1],
                              'ipAddress' => $result[0][2],
                              'totalLifeCans' => $result[0][3],
                              'readingsContainer' => $readingContainer
                        );
                  }
                  else
                  {
                        $device = array(
                              'idMac' => $result[0][0],
                              'description' => $result[0][1],
                              'ipAddress' => $result[0][2],
                              'totalLifeCans' => $result[0][3],
                              'readingsDuck' => $readingDuck
                        );
                  }

                  

                  echo json_encode(array(
                              'status' => 0,
                              'device' => $device
                  ));

		}
		else
		{
      		$connection = new MySqlServerConnection();
      		//consulta fea
      		$query = 'SELECT idMac, description, ipAddress, totalLifeCans
					FROM devices';
      		$result = $connection->executeQuery($query, array());

      		$longitudArray = COUNT($result);
      		$i = 0;

      		$arrayDevices = array();

      		while ($i < $longitudArray) 
      		{
      			$device = array(
      				'idMac' => $result[$i][0],
      				'description' => $result[$i][1],
      				'ipAddress' => $result[$i][2],
      				'totalLifeCans' => $result[$i][3]
      			);

      			array_push($arrayDevices, $device);
      			$i++;
      		}

      		echo json_encode(array(
      					'status' => 0,
      					'devices' => $arrayDevices
      		));
		}
	}

?>