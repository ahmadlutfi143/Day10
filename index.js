const express = require('express');
const { redirect } = require('express/lib/response');
const db = require('./connection/db.js');
const hbs = require('hbs');

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
const app = express();
const PORT = 900;


app.set('view engine','hbs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

const addProject=[];

app.get('/', (req, res) => {
  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = 'SELECT * FROM tb_projects'

    client.query(query, function(err, result) {
        if (err) throw err;


        const addProject = result.rows

        function difference(date1, date2) {
          date1 = new Date(date1);
          date2 = new Date(date2);
          const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
          const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
            day = 1000*60*60*24;
            dif =(date2utc - date1utc)/day;
          return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
        }
        
        function getFullTime(start_date,end_date){
          start_date= new Date(start_date);
          end_date = new Date(end_date);
          return `${start_date.getDate()} ${month[start_date.getMonth()]} ${start_date.getFullYear()} - ${end_date.getDate()} ${month[end_date.getMonth()]} ${end_date.getFullYear()}`;
        }
      const projectCard = addProject.map ((data) => {
          
          return {
              duration: difference(data.start_date, data.end_date),
              ...data
          }
        })
        
        res.render ('index',{addProject:projectCard} )
    })
    done()
  })
})


app.get('/project', (req, res) => {
  res.render('project');
})

app.post('/project',(req,res)=>{

  const name = req.body.project_name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const description = req.body.description;
  const technologies = [];
  const image = req.body.upload_image;
  
    if (req.body.cekHtml) {
        technologies.push('Html');
    } else {
        technologies.push('')
    }
    if (req.body.cekCss) {
        technologies.push('Css');
    } else {
        technologies.push('')
    }
    if (req.body.cekReact) {
        technologies.push('React');
    } else {
        technologies.push('')
    }
    if (req.body.cekJavascript) {
        technologies.push('Javascript');
    } else {
        technologies.push('')
    }
  

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `INSERT INTO tb_projects (name, start_date, end_date, description, technologies, image) 
                   VALUES ('${name}', '${start_date}', '${end_date}', '${description}', ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], '${image}')`

    client.query(query, function (err, result) {
      if (err) throw err;

      res.redirect('/');
    });

    done();
  });
});

app.get('/edit-project/:id',(req,res)=>{
  let editor = req.params.id;

  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = `SELECT * FROM tb_projects WHERE id =${editor}`

    client.query(query, function(err, result) {
        if (err) throw err;

        const addProject = result.rows[0]        

         res.render('edit-project', {
          edit: addProject,
          id: editor
      })
    })
    done()
  })
})

app.post('/edit-project/:id',(req,res)=>{
  let revision = req.params.id

  const name = req.body.project_name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const description = req.body.description;
  const technologies = [];
  const image = req.body.upload_image;
  
    if (req.body.cekHtml) {
        technologies.push('Html');
    } else {
        technologies.push('')
    }
    if (req.body.cekCss) {
        technologies.push('Css');
    } else {
        technologies.push('')
    }
    if (req.body.cekReact) {
        technologies.push('React');
    } else {
        technologies.push('')
    }
    if (req.body.cekJavascript) {
        technologies.push('Javascript');
    } else {
        technologies.push('')
    }
  

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `UPDATE tb_projects 
                    SET name = '${name}', start_date = '${start_date}', end_date = '${end_date}', description = '${description}', technologies = ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], image='${image}' 
                    WHERE id=${revision};`

    client.query(query, function (err, result) {
      if (err) throw err;

      res.redirect('/');
    });

    done();
  });
});

app.get('/project/delete/:id',(req,res)=>{
  let revision = req.params.id

    db.connect(function(err, client, done) {
        if (err) throw err;

        const query = `DELETE FROM tb_projects WHERE id = ${revision};`;

        client.query(query, function(err, result) {
            if (err) throw err;

            res.redirect('/');
        });

        done();
    });
})

app.get('/contact', (req, res) => {
  res.render('contact');
})

app.get("/project-detail/:id", (req, res) => {
  let revision = req.params.id;
 
  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = `SELECT * FROM tb_projects WHERE id = ${revision}` //perubahan 1

    client.query(query, function(err, result) {
        if (err) throw err;


        function difference(edate, sdate) {
          sdate = new Date(sdate);
          edate = new Date(edate);
          // const sdateutc = Date.UTC(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
          // const edateutc = Date.UTC(edate.getFullYear(), edate.getMonth(), edate.getDate());
            day = 1000*60*60*24;
            dif = (edate - sdate)/day;
          return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
        }
        
        function getFullTime(time){
          time = new Date(time);
          const date = time.getDate();
          const monthIndex = time.getMonth();
          const year = time.getFullYear();
          let hour = time.getHours();
          let minute = time.getMinutes();
          const fullTime = `${date} ${month[monthIndex]} ${year}`;

    return fullTime
        }

        const detailProject = result.rows[0]
        
        detailProject.start_date = getFullTime(detailProject.start_date)
        detailProject.end_date = getFullTime(detailProject.end_date)
        detailProject.duration = difference (detailProject.end_date, detailProject.start_date)

        res.render ('project-detail',{ addProject: detailProject } ) //perubahan 3
    })
    done()
  })

});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });

function difference(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    day = 1000*60*60*24;
    dif =(date2utc - date1utc)/day;
  return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
}

function getFullTime(dateStart,dateEnd){
  dateStart= new Date(dateStart);
  dateEnd = new Date(dateEnd);
  return `${dateStart.getDate()} ${month[dateStart.getMonth()]} ${dateStart.getFullYear()} - ${dateEnd.getDate()} ${month[dateEnd.getMonth()]} ${dateEnd.getFullYear()}`;
}