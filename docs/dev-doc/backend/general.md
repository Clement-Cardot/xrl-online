# General information

The Backend of our application is very standard, we retrieve data from our database thanks to spring mongodb connector then we store them in Entities wich are then used by our services to perform operations on them. After that we map them to DTO (Data Transfer Object) to send them to the frontend though our controllers.

This is also called the 3-tier architecture :

![3-tier architecture](<../../assets/3-tier architecture.png>)