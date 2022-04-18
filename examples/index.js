import './index.css'
import { createTheme, Grid, Paper, ThemeProvider, withTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from '../src/base/DataTable';
import { AxiosDataProvider } from '../src/core/DataSource';
import { DataList, LoadingOverlay, RebexDataProvider, useRebexForm } from '../src/index';
import SaveIcon from '@mui/icons-material/Save'
import * as yup from 'yup'

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

function ExampleForm(props) {
  const form = useRebexForm({
    submit: (form) => console.log(form)
  });

  return (<Paper sx={{ p: 2, m: 1, display: 'inline-block', width: '100%', maxWidth: 600, position: 'relative' }} elevation={10}>
    <LoadingOverlay loading={form.loading} />
    {form.title('Form 1')}

    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'checkbox', name: 'checkbox1', title: 'CheckBox Item', label: 'Enable Notifications' })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'radiolist', items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' }
        ], name: 'radios', title: 'Radio List Item', label: 'Severity Level' })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'text', name: 'firstName', title: 'First Name', placeholder: 'First Name', required: true })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'text', name: 'lastName', title: 'Last Name', placeholder: 'Last Name', required: true })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'tel', name: 'phone', title: 'Phone', placeholder: 'Phone' })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ validate: yup.string().email(), type: 'email', name: 'email', title: 'Email', placeholder: 'Email' })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'date', name: 'birthDate', title: 'Birth Date', placeholder: 'Birth Date' })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'daterange', name: 'workDate', title: 'Work Date', placeholder: 'Work Date' })}
      </Grid>
      <Grid item xs={12} sm={6}>
        {form.place({ type: 'time', name: 'yearPicker', title: 'Year Picker', placeholder: 'Year Picker' })}
      </Grid>
    </Grid>

    <Grid container justifyContent={"flex-end"} mt={2}>
      {form.placeButton({
        type: 'submit',
        title: 'Save',
        icon: <SaveIcon sx={{ mr: 1 }} />,
        props: {
          variant: 'contained'
        },
        validated: true,
        onClick: async (form) => {
          //console.log(a,b);
          await form.submit();
        }
      })}
    </Grid>

  </Paper>);
}

function ExamplePage(props) {
  return (<div style={{}}>

    <ThemeProvider theme={darkTheme}>
      <RebexDataProvider provider={dataProvider}>


        <ExampleForm />


        {/* <DataTable source={{
          path: 'photos',
          method: 'get'
        }}
          title='Tablo - 1'

          columns={[
            {
              field: 'id',
              title: 'ID',
              align: 'center'
            },
            // {
            //   title: 'Image',
            //   customValue: (row) => "https://picsum.photos/200",
            //   renderer: 'image'
            // },
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
        /> */}
      </RebexDataProvider>
    </ThemeProvider>
  </div>);
}

ReactDOM.render(<ExamplePage />, document.getElementById('app-root'));
