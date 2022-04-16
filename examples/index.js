import './index.css'
import { createTheme, ThemeProvider, withTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from '../src/base/DataTable';
import { AxiosDataProvider } from '../src/core/DataSource';
import { DataList, LoadingOverlay, RebexDataProvider } from '../src/index';

const darkTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

const dataProvider = new AxiosDataProvider({
  url: 'https://jsonplaceholder.typicode.com/',
  headers: {
    'Content-Type': 'application/json',
  }
});

function ExamplePage(props) {
  return (<div style={{}}>

    <ThemeProvider theme={darkTheme}>
      <RebexDataProvider provider={dataProvider}>



        <DataTable source={{
          path: 'posts',
          method: 'get'
        }}
          style={{ borderRadius: 6 }}
          title='Tablo - 1'

          columns={[
            {
              field: 'id',
              title: 'ID',
              align: 'center'
            },
            {
              title: 'Image',
              customValue: (row) => "https://picsum.photos/200",
              renderer: 'image'
            },
            {
              title: "Company",
              customValue: (row) => row.company && row.company.name,
              disableSort: true
            },
            {
              title: 'Name',
              field: 'name',
              align: 'right'
            },
            {
              title: 'User Name',
              field: 'username',
              computedProps: (props)=>{
                return {
                  ...props,
                  style: {
                    ...props,
                    //pastel red by rgba
                    backgroundColor: 'rgba(255, 0, 0, 0.5)'
                  }
                }
              }
            },
            {
              title: 'Email',
              field: 'email',
              renderer: {
                name: "email"
              }
            },
            {
              title: 'Phone',
              field: 'phone',
              renderer: {
                name: "phone"
              }
            },
            {
              title: "Website",
              field: "website",
              renderer: {
                name: "url"
              }
            },
            {
              title: "Status",
              field: "status",
              renderer: "status",
              map: {
                '0': 'Inactive',
                '1': 'Active',
                '2': 'Pending',
                '3': 'Banned',
                '4': 'Deleted',
                undefined: 'Unknown'
              },
              colorMap: {
                '0': 'danger',
                '1': 'success',
                '2': 'warning',
                '3': 'info',
                '4': 'primary',
                undefined: 'warning'
              }
            },
            {
              title: "test",
              field: "test",
              calculate: (row) => {
                return new Date();
              },
              format: {
                "name": "date"
              }
            }
          ]}
        />
      </RebexDataProvider>
    </ThemeProvider>
  </div>);
}

ReactDOM.render(<ExamplePage />, document.getElementById('app-root'));
