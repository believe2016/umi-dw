import React from 'react';
import config from "@/config";
import  './doctor.css';


export default function() {
  console.log('doctor', config);

  return (
    <div className="">
      <h1>Page doctor</h1>
      <p>{JSON.stringify(config)}</p>
    </div>
  );
}
