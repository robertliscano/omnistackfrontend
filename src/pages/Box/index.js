import React, { Component } from 'react';
import api from "../../services/api";
import { distanceInWords } from 'date-fns';
import pt from "date-fns/locale/pt";
import Dropzone from "react-dropzone";
import socket from "socket.io-client"; 


import { MdInsertDriveFile } from "react-icons/md";

import logo from "../../assets/logo.svg";
import "./styles.css";

export default class Box extends Component {
  state = { box: {} }

  async componentDidMount() {
    this.subscribeToNewFiles();
  
    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);
    //console.log(this.state.box.title);
    
    this.setState({ box: response.data });
    
  }    

    subscribeToNewFiles = () => { 
      const box = this.props.match.params.id;
      const io = socket('https://appomnistack-backend.herokuapp.com/');
    
    io.emit("connectRoom", box);

    io.on("file", data => {
      this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files] } })
      console.log(data);
    });
  };


  handleUpload = files => {
    files.forEach(file => {
    const data = new FormData();
    const box = this.props.match.params.id;

    data.append('file', file);

    api.post(`boxes/${box}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" { ...getRootProps()}>
              <input {...getInputProps()} />

            <p>Arraste arquivos ou clique aqui</p>
            </div>

          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
           this.state.box.files.map(file => (
            <li key={file._id}>
            <a className= "fileInfo" href={"file.url"} target="blank"> 
               <MdInsertDriveFile size={24} color ="#A5Cfff" />
               <strong>{file.title}</strong>
            </a>

            <span>
            há{" "}
            {distanceInWords(file.createdAt, new Date(), {
              locale: pt
            })}
            </span>
          </li>
           ))}
        </ul>
      </div>
    );
  }




  //Codigo de teste:

/*   render() {
     return (
       <div id="box-container">
         <header>
           <img src={logo} alt= ""/>
           <h1>{this.state.box.title}</h1>
         </header>

         <ul>
           <li>
             <a href="" className="fileInfo">
                <MdInsertDriveFile size={24} color="#A5Cfff" />
                <strong>Desafio.pdf</strong>
             </a>

             <span>há 3 minutos atrás</span>
           </li>

           <li>
             <a href="">
                <MdInsertDriveFile size={24} color="#A5Cfff" />
                <strong>Desafio2.pdf</strong>
             </a>

             <span>há 3 minutos atrás</span>
           </li>
         </ul>
       </div>
     )
  
  }*/
}
