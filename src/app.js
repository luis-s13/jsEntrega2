const express =require ('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser= require('body-parser'); //para procesar post
const port = process.env.PORT || 3000;

const dirNode_modules = path.join(__dirname, '../node_modules')

//
//declaracionesBD
const MongoClient= require('mongodb').MongoClient;

//connection URL
const url='mongodb://localhost:27017';

//database Name
const dbName ='extension';

// create a new mongoClient
const client = new MongoClient(url, {useNewUrlParser: true   });

// Use connect method to connect to the server
client.connect(function(err) {
    if(err){
       return console.log("No se pudo conectar a mongoDB");
    }

console.log('Conectado mongoDB');

const db=client.db(dbName);

const collectionCursos= db.collection('cursos');
const collectionEstudiantes= db.collection('inscritos');


//insertar dato de prueba en cursos
collectionCursos.insertOne({
	idcurso:1,
	nombrecurso:"Gestion TICS",
	descripcioncurso:"Curso de marcos orientado a TICS",
	costo:100,
	modalidad:"Presencial",
	intensidad:38,
	estado:"Disponible"
 },(err,result)=>{
	 if(err){
		  return console.log("error ingresando usuario")
	  }
	 return console.log(result.ops)
 }  )
/*
//insertar dato de prueba en inscritos
  collectionEstudiantes.insertOne({
	  estudiante: "Jose",
	  documento:3,
	  correo:"jose@outlook.com",
      telefono:4004000,
      cursoactual:1
   },(err,result)=>{
       if(err){
            return console.log("error ingresando usuario")
        }
       return console.log(result.ops)
   }  )

*/
client.close();
});


app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));


require ('./helpers');

const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);

app.use(bodyParser.urlencoded({extended:false})); //para post

app.set('view engine','hbs');

app.get('/',(req,res) =>{
	res.render('index', {
		//estudiante: 'Student'
	});
});

app.get('/pagina2',(req,res) =>{
	res.render('pagina2', {
		//estudiante: 'Student'
	});
});

app.get('/pagina3',(req,res) =>{
	res.render('pagina3', {
		//estudiante: 'Student'
	});
});

app.get('/pagina4',(req,res) =>{
	res.render('pagina4', {
		//estudiante: 'Student'
	});
});

app.get('/pagina5',(req,res) =>{
	res.render('pagina5', {
		//estudiante: 'Student'
	});
});

app.post('/paginaCursoCreado',(req,res) =>{ //para post
	
	res.render('paginaCursoCreado', {
		idTemp: parseInt (req.body.id),//body porque es post
		cursoTemp: req.body.curso,//body porque es post
		descripcionTemp: req.body.descripcion,//body porque es post
		costoTemp: parseInt (req.body.costo),//body porque es post
		modalidadTemp: req.body.modalidad,//body porque es post
		intensidadTemp: parseInt (req.body.intensidad)|| 0,//body porque es post
	});
});

app.post('/paginaResultInscripcion',(req,res) =>{ //para post
	
	res.render('paginaResultInscripcion', {
		documentoE: parseInt (req.body.docidentidad),//body porque es post
		correoE: req.body.correo,//body porque es post
		nombreE: req.body.nombre,//body porque es post
		telefonoE: parseInt (req.body.telefono),//body porque es post
		idcursoE: req.body.idcurso,//body porque es post
	});
});

app.post('/detalleInscritosCurso',(req,res) =>{ //para post
	
	res.render('detalleInscritosCurso', {
		idcE: parseInt (req.body.idcursosel),//body porque es post
	});
});

app.post('/paginaEliminar',(req,res) =>{ //para post
	
	res.render('paginaEliminar', {
		nombreE: req.body.nombreEstudiante,
		idcE: parseInt (req.body.numCurso),//body porque es post
	});
});

app.post('/estadoCambiado',(req,res) =>{ //para post
	
	res.render('estadoCambiado', {
		idcursoE: parseInt (req.body.idcurso),//body porque es post
	});
});


app.listen(port, () => {
	console.log('servidor en el puerto '+port)
})