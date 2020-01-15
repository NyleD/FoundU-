# How To Start an Application
to run an application run the following command:
### ```yarn start```
additionally, if you prefer, you can specify a specific port to run an application with:
### ```yarn start --port ####```


# Currently available API Endpoints:
**NOTE**: all api must be prefixed with ```/api```

## User Endpoints
| API ENDPOINTS                         | REQUIRES AUTH TOKEN | REQUIRED QUERY PARAMS                                | REQUIRED BODY PARAMS                                                                        |
|:--------------------------------------|:-------------------:|:----------------------------------------------------:|:-------------------------------------------------------------------------------------------:|
| **GET** ```/users/me```               | TRUE                | **NONE**                                             | **NONE**                                                                                    |
| **POST** ```/users/signup```          | FALSE               | **NONE**                                             | ```username```: String<br>```password```: String<br>```email```:String<br>```name```:String | 
| **POST** ```/users/login```           | FALSE               | **NONE**                                             | ```username```: String<br>```password```: String                                            |
| **DELETE** ```/users/logout```        | TRUE                | **NONE**                                             | **NONE**                                                                                    |
| **GET** ```/users/```                 | FALSE               | ```pageNum```: Integer<br> ```numRecords```: Integer | **NONE**                                                                                    |
| **GET** ```/users/search/name```      | FALSE               | ```name```: String                                   | **NONE**                                                                                    |
| **GET** ```/users/search/username```  | FALSE               | ```username```: String                               | **NONE**                                                                                    |
| **POST** ```/users/friends/request``` | TRUE                | **NONE**                                             | ```friendId```: String                                                                      |
| **POST** ```/users/friends/accept```  | TRUE                | **NONE**                                             | ```friendId```: String                                                                      |
| **DELETE** ```/users/friends/```      | TRUE                | **NONE**                                             | ```friendId```: String                                                                      |