-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: panaderia_desesperanza
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (5,'Concha','Pan dulce',10.00,57,'https://laroussecocina.mx/wp-content/uploads/2017/12/concha-001-larousse-cocina.jpg.webp'),(6,'Pan de Muerto Tradicional','Pan dulce tradicional decorado con huesitos de masa y espolvoreado con azúcar.',26.00,30,'https://www.elglobo.com.mx/cdn/shop/products/Pan_de_Muerto_Tradicional_Naranja_Familiar_Ok_1_800x.jpg?v=1663974194'),(7,'Concha de Chocolate','Pan esponjoso con cobertura de chocolate y forma de concha.',15.00,96,'https://icdn.planb.mx/uploads/2023/05/pan-dulce-mexican-sweet-bread-1001x1024.jpg?strip=all&lossy=1&ssl=1'),(8,'Calaverita de Azúcar','Galleta decorada como calaverita de azúcar para celebrar el Día de Muertos.',10.00,75,'https://mojo.generalmills.com/api/public/content/cBlWdvRSXEmFjkVRUAVp3g_gmi_hi_res_jpeg.jpeg?v=25f6c4d1&t=16e3ce250f244648bef28c5949fb99ff'),(9,'Ojo de Pan (Especial de Halloween)','Pan dulce en forma de ojo decorado para Halloween, ideal para fiestas.',25.00,46,'https://static.guiainfantil.com/pictures/recetas/3989-ojos-sangrientos-para-halloween-una-receta-para-elaborar-con-ninos.jpg'),(10,'Concha de Vainilla','Pan esponjoso con cobertura de vainilla, ideal para acompañar un café.',15.00,90,'https://cheforopeza.com.mx/wp-content/uploads/2022/02/concha-940x450.jpg'),(11,'Bolillo Tradicional','Pan salado y crujiente perfecto para hacer tortas.',5.00,200,'https://i.ytimg.com/vi/7WSGL1hJ0ZM/sddefault.jpg'),(13,'Rosca de Pan Dulce','Rosca de pan dulce decorada con fruta cristalizada.',50.00,19,'https://i.blogs.es/54ef01/rosca-de-reyes-mexicana/1366_2000.jpg'),(14,'Panqué de Nuez','Panqué suave con trozos de nuez, perfecto para acompañar con leche o café.',35.00,30,'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/4FA65979-89C2-4CAB-B827-35734DD5C41C/Derivates/6a66a501-05e1-424b-bb01-4cd8df5a4027.jpg'),(15,'Fantasma de Coco (Especial de Halloween)','Pan en forma de fantasma con sabor a coco y decoraciones espeluznantes.',20.00,35,'https://i.ytimg.com/vi/EOLqPLitPAI/maxresdefault.jpg'),(26,'Pan de Muerto con Chocolate','Pan de muerto relleno de chocolate y espolvoreado con azúcar.',35.00,57,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPnkNKn0BwOUVVDzq5LuDYJUQASLnpaAfoA&s'),(27,'Pan de Elote','Suave y esponjoso pan de elote, ideal para el desayuno.',20.00,79,'https://cdn7.kiwilimon.com/recetaimagen/33525/640x640/38880.jpg.webp'),(28,'Cuernito','Pan dulce con forma de cuerno, ideal para acompañar café.',15.00,100,'https://lacasadelpanbakery.com/wp-content/uploads/2022/10/kisspng-croissant-danish-pastry-pan-dulce-bakery-portugues-5aef9d2068de19.4414788515256527684296-removebg-preview.png'),(30,'Pan de Queso','Pan dulce relleno de queso crema.',25.00,87,'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/931BB2EC-E5B4-4B7C-A82C-887BF487871D/Derivates/49E4DA02-8DFA-4113-99D6-42A50F3E61CE.jpg'),(32,'Churros','Deliciosos churros espolvoreados con azúcar y canela.',18.00,48,'https://www.recipetineats.com/tachyon/2016/08/Churros_9-SQ.jpg?resize=500%2C500'),(33,'Bollito de Ajonjolí','Pan suave espolvoreado con ajonjolí, ideal para el desayuno.',10.00,100,'https://i.ytimg.com/vi/ziyBLICer84/maxresdefault.jpg'),(34,'Galleta de Mantequilla','Galleta suave y crujiente de mantequilla.',5.00,200,'https://i0.wp.com/www.manualidadesapasos.com/wp-content/uploads/2020/04/Receta-de-galletas-de-mantequilla.jpg?resize=818%2C524&ssl=1'),(35,'Pan de Plátano','Pan suave y húmedo con trozos de plátano.',22.00,70,'https://myplate-prod.azureedge.us/sites/default/files/styles/large/public/2024-09/Banana%20Bread.jpg?itok=ha5n6U5D'),(36,'Masa para Tamales','Masa especial para preparar tamales.',50.00,30,'https://i.ytimg.com/vi/KjeOQM1PkkU/maxresdefault.jpg'),(37,'Empanada de Cajeta','Empanada dulce rellena de cajeta.',25.00,40,'https://i.blogs.es/f270c9/como-hacer-empanadas-de-cajeta-2-/1366_2000.jpg'),(38,'Pan de Jamón','Pan salado relleno de jamón y queso.',40.00,60,'https://cdn.recetasderechupete.com/wp-content/uploads/2019/12/Pan-de-jam%C3%B3n.jpg'),(39,'Galletas de Chocolate','Galletas crujientes de chocolate con chispas.',15.00,84,'https://s1.elespanol.com/2023/04/09/cocinillas/recetas/postres/754934523_232288662_1706x960.jpg'),(40,'Cemitas','Pan mexicano típico, perfecto para tortas.',12.00,80,'https://www.paulinacocina.net/wp-content/uploads/2023/06/receta-de-cemitas-poblanas.jpg'),(42,'Galletas de Nuez','Galletas crujientes de nuez con un toque de canela.',15.00,70,'https://cdn7.kiwilimon.com/recetaimagen/21891/640x640/11818.jpg.webp'),(50,'Buñuelos','Fritos y espolvoreados con azúcar, perfectos para el desayuno.',12.00,60,'https://tvpacifico.mx/recetas/intranet/images/recipes/555-598.png'),(52,'Cocoles','Pan redondo y suave, típico de la región.',15.00,74,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc0sL4dVVIEowJ9Qe84mLfQn--8qFDTwq0iA&s'),(53,'Pan de Ajo','Pan salado con un delicioso sabor a ajo.',30.00,50,'https://recetasdecocina.elmundo.es/wp-content/uploads/2015/10/pan-de-ajo-casero.jpg'),(55,'Pastel de Tres Leches','Pastel suave y húmedo bañado en tres tipos de leche.',50.00,30,'https://cocinamia.com.mx/wp-content/uploads/2021/03/Pastel_1080X490-1100x500.jpg'),(58,'Donut','donita',10.00,5,'https://media.istockphoto.com/id/538335769/photo/donut-with-sprinkles-isolated.jpg?s=612x612&w=0&k=20&c=rCA_fEe8H3qwXT20aYfRJTrMHpSB8deFuiKK0ygQLwg=');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01 18:40:17
