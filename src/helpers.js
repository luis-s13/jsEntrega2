const fs = require('fs')
const cursosI=require('./funcionescursos.js');
const hbs=require('hbs');
listaCursos = require('../data/cursos.json')
listaEstudiantes = require('../data/estudiantes.json')


hbs.registerHelper('obtenerPromedio',(nota1,nota2,nota3)=>{
return (nota1+nota2+nota3)/3
});

hbs.registerHelper('ValoresSelectCursos',()=>{
    //let val=0;
    textov='';
    listaCursos.forEach(curso => {
                //val++;
                if(curso.estado=='Disponible')
                {
                textov=textov+'<option value="' +curso.idcurso +'">'+curso.nombrecurso+'</option>';
                }
           })
           return textov;
    });

    hbs.registerHelper('ValoresSelectAllCursos',()=>{
        //let val=0;
        textov='';
        listaCursos.forEach(curso => {
                    //val++;
                textov=textov+'<option value="' +curso.idcurso +'">'+curso.nombrecurso+'</option>';
               })
               return textov;
        });

    hbs.registerHelper('cambiarEstadoCurso',(idcursoE)=>{
        //let val=0;
        listaCursosA = require('../data/cursos.json')
        cursoId=idcursoE;
        let encontrado = listaCursosA.find(buscar => buscar.idcurso == cursoId)
                if(encontrado)
                    {
                        if(encontrado.estado=='Disponible') {
                            encontrado.estado='Cerrado'   
                             }
                        else{
                            encontrado.estado='Disponible'
                            }
                        //let tmp=curso;
                        let datos = JSON.stringify(listaCursosA)
                        fs.writeFile('./data/cursos.json', datos, err=>{
                              if(err) throw(err)
                              console.log("Estado en Archivo cursos.json fue actualizado satisfactoriamente")
                        })
                    }
                    else{
                        console.log('Error: No se encontro curso para cambiar estado');
                    }

            
        });

    hbs.registerHelper('accionInscribir',(documentoE,correoE,nombreE,telefonoE,idcursoE)=>{
        var llavescompuestas=[];
        let textoci="*";
        let llavetemp='';
        let llaveregistro=nombreE+idcursoE;
        let tituloCurso;

        listaCursos.forEach(curso => {
            //val++;
            if(curso.idcurso==idcursoE)
            {
                tituloCurso=curso.nombrecurso;
            }
         })


        //crear array de llaves compuestas temporales
        listaEstudiantes.forEach(registro => {
                    llavetemp=registro.estudiante+registro.cursoactual;
                    llavescompuestas.push(llavetemp);
                   //textoci= textoci + llavetemp+'%';
               })
        let resllave=false;
        llavescompuestas.forEach(fila=> {
            if(fila==llaveregistro)
                {
                    resllave=true;
                }
        })
            if (resllave)
               {
                textoci=textoci+'Error: el estudiante '+nombreE +
                ' ya se encuentra matriculado en el curso '+tituloCurso;
               }
            else
               {
                
                textoci=textoci+'Registro nuevo';

                let inscritoGuardar= {
                    estudiante:nombreE,
                    documento:documentoE,//body porque es post
                    correo:correoE,//body porque es post
                    telefono:telefonoE,//body porque es post
                    cursoactual:idcursoE//body porque es post
                    };
                listaEstudiantes.push(inscritoGuardar);
                let datos = JSON.stringify(listaEstudiantes)
                fs.writeFile('./data/estudiantes.json', datos, err=>{
                      if(err) throw(err)
                      console.log("Archivo estudiantes.json fue actualizado satisfactoriamente")
                })
                textoci=textoci+" Exitoso, el estudiante "+nombreE+" se inscribio en el curso "+tituloCurso;
               }

        return textoci;
        });

hbs.registerHelper('accionIdCurso',(idTemp,cursoTemp,modalidadTemp,costoTemp,descripcionTemp,intensidadTemp)=>{
    idVerificar=idTemp;
    let textoci="*";
    //console.log('nombre leido:'+nom)
    let encontrado = listaCursos.find(buscar => buscar.idcurso == idTemp)
    if (encontrado){
        console.log('error: id de curso ingresado('+idVerificar+ ') ya existe');
        textoci=textoci+" El curso no se pudo crear (el ID ["+idVerificar+ "] ya existe). ";
        textoci=textoci+"A continuacion se listan los cursos existentes:"
    }
    else{
        //textoci=textoci+" El curso ha sido ingresado(ID ok)";
       //guardar
       let cursoGuardar= {
        idcurso:idTemp,
        nombrecurso:cursoTemp,//body porque es post
        descripcioncurso:descripcionTemp,//body porque es post
        costo:costoTemp,//body porque es post
		modalidad:modalidadTemp,//body porque es post
        intensidad:intensidadTemp,//body porque es post
        estado:"Disponible"
        };

        listaCursos.push(cursoGuardar);
        let datos = JSON.stringify(listaCursos)
        fs.writeFile('./data/cursos.json', datos, err=>{
            if(err) throw(err)
            console.log("Archivo cursos.json fue actualizado satisfactoriamente")
        })
        console.log(' El curso fue creado satisfactoriamente');
        textoci=textoci+' El curso '+cursoTemp+' con id '+idTemp+' fue creado satisfactoriamente';
    }
    return textoci;
    });

hbs.registerHelper('listarcursosadmin',()=>{
    listaCursosN = require('../data/cursos.json')
    let textoc=" <thead> \
                <th> Id Curso </th>\
                <th> Nombre Curso </th>\
                <th> Descripción del Curso </th>\
                <th> Costo </th>\
                <th> Modalidad </th>\
                <th> Intensidad </th>\
                <th> Estado </th>\
                </thead> \
                <tbody>";

        listaCursosN.forEach(curso => {
 //      if(curso.estado=='Disponible')  
 //       {
        textoc= textoc + 
                '<tr>'+
                '<td>'+ curso.idcurso + '</td>' +
                '<td>'+ curso.nombrecurso + '</td>' +
                '<td>'+ curso.descripcioncurso + '</td>' +
                '<td>'+ curso.costo+'</td>'+
                '<td>'+ curso.modalidad + '</td>' +
                '<td>'+ curso.intensidad + '</td>' +
                '<td>'+ curso.estado+ '</td>' +
                '</tr>'
//        }
    })
    //textoc=textoc+'</tbody>';
    return textoc;               
});

hbs.registerHelper('listarcursosinteresado',()=>{
    let textoc='';
    listaCursosN = require('../data/cursos.json')
        listaCursosN.forEach(curso => {
        if(curso.estado=='Disponible')  
        {
        textoc= textoc + 
                '<button class="collapsible">'+curso.nombrecurso+'[+]</button>'+ 
                '<div class="content"><strong>ID: </strong><em>'+ curso.idcurso +'</em><br>' +
                '<strong>Nombre del Curso:</strong><em>'+ curso.nombrecurso + '</em><br>' +
                '<strong>Descripcion:</strong><em>'+ curso.descripcioncurso + '</em><br>' +
                '<strong>Costo:</strong><em>'+ curso.costo+' USD</em><br>'+
                '<strong>Modalidad:</strong><em>'+ curso.modalidad + '</em><br>' +
                '<strong>Intensidad:</strong><em>'+ curso.intensidad + ' horas</em><br>' +
                ' </div>'
        }
    })
    //textoc=textoc+'</tbody>';
    return textoc;               
});

hbs.registerHelper('listarTodosEstudiantes',()=>{
    listaEstudiantesN = require('../data/estudiantes.json')
    let textoe=" <tr> \
                <th> Estudiante </th>\
                <th> Documento </th>\
                <th> Correo </th>\
                <th> Telefono </th>\
                <th> Curso</th>\
                </tr>";

        listaEstudiantesN.forEach(estudiante => {
 //      if(curso.estado=='Disponible')  
 //       {
        //console.log('leido:'+leido+',idcurso:'+estudiante.cursoactual );
        textoe= textoe + 
                '<tr>'+
                '<td>'+ estudiante.estudiante + '</td>' +
                '<td>'+ estudiante.documento + '</td>' +
                '<td>'+ estudiante.correo + '</td>' +
                '<td>'+ estudiante.telefono+'</td>'+
                '<td>'+ estudiante.cursoactual + '</td>' +
                '</tr>'
//        }
    })
    //textoc=textoc+'</tbody>';
    return textoe;               
});

hbs.registerHelper('CursoSeleccion',(idcE)=>{
    //let val=0;
    let cursoSeleccionado;

    listaCursos.forEach(curso => {
        //val++;
        if(curso.idcurso==idcE)
        {
            cursoSeleccionado=curso.nombrecurso;
        }
     })
        return cursoSeleccionado;
    });

hbs.registerHelper('crearFormActions',(idcE)=>{
    //crear form actions para activar botones que se crean;
    let textof='';

    listaEstudiantes.forEach(inscrito => {
        //val++;
        if(inscrito.cursoactual==idcE)
        {
            textof= textof + 
            '<form action="/paginaEliminar" method="post" id="form'+inscrito.estudiante+'">'+
            '<input type="hidden" id="custId" name="nombreEstudiante" value="'+
            inscrito.estudiante+'">'+
            '<input type="hidden" id="custId" name="numCurso" value="'+
            idcE+'">'+
            '</form>';
        }
    })
    return textof;
    });    

    hbs.registerHelper('eliminarInscrito',(nombreE,idcE)=>{
        idVerificar=idcE;
        nombreVerificar=nombreE;
        //let textoci="*";
        let encontrado = listaEstudiantes.find(buscar => buscar.estudiante == nombreVerificar)
        if (!encontrado){
            console.log('Error: el estudiante '+nombreVerificar+'no fue encontrado');
        }
        else{
            //comprobar y verificar
            listaEstudiantes.forEach(inscrito => {
                //val++;
                if(inscrito.cursoactual==idVerificar && inscrito.estudiante== nombreVerificar )
                {
                    let eliminado=inscrito;
                    let nuevo =listaEstudiantes.filter(registro => registro != eliminado)
                    if(nuevo.length==listaEstudiantes.length){
                        console.log('el filtro no elimina ningun estudiante');
                    }
                    else{
                        listaEstudiantes=nuevo;
                        let datos = JSON.stringify(listaEstudiantes)
                        fs.writeFile('./data/estudiantes.json', datos, err=>{
                        if(err) throw(err)
                            console.log("Archivo estudiantes.json fue actualizado satisfactoriamente")
                        })
                        console.log('lista de estudiantes actualizada satisfactoriamente');
                    }
                }
            })
            
        }
        }); 

hbs.registerHelper('listarInscritosCurso',(idcE)=>{
    let textoi='';
    textoi= textoi + 
    " <tr> \
    <th> Estudiante </th>\
    <th> Documento </th>\
    <th> Correo </th>\
    <th> Telefono </th>\
    <th> Eliminar</th>\
    </tr>";

    listaEstudiantes.forEach(inscrito => {
            //val++;
            if(inscrito.cursoactual==idcE)
            {
                textoi= textoi + 
                //'<form action="/action_page.php" method="post" id="form'+inscrito.estudiante+'">'
                '<tr>'+
                '<td>'+ inscrito.estudiante + '</td>' +
                '<td>'+ inscrito.documento + '</td>' +
                '<td>'+ inscrito.correo + '</td>' +
                '<td>'+ inscrito.telefono+'</td>'+
                '<td>'+ 
                '<button type="submit" form="form'+inscrito.estudiante+
                '" value="Submit">Eliminar</button>'+  
                '</td>'+
                '</tr>';
                //'</form>';
  
            }
        })
           return textoi;
    });