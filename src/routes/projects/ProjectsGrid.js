import React from 'react';
import { Link } from "react-router-dom"
import { Button,Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useGlobalReducer } from '../../Store';
import { SET_ACTIVE_TASKID } from '../../reducers/GlobalStateReducer'
import { ASTROBASE_URL } from '../../utils/skyserver'
import ChildrenGrid from './ChildrenGrid'
import { getChildren } from '../../utils/filterObservations'
import { getMode, getExposure, getIcon } from '../../utils/astro'

export default function ProjectsGrid(props) {
    const [ my_state , my_dispatch] = useGlobalReducer()

    const handleClick = (observation) => {
        // dispatch current observation to the global store
        my_dispatch({type: SET_ACTIVE_TASKID, taskid: observation.taskID})
    }

    // generate the details link to forward to
    const getLink = (observation) => {
        let details_link = "/details/"+observation.taskID
        return details_link
    }

    // generate the api link
    const getAPI = (observation) => {
        //let api_link = ASTROBASE_URL + "observations/" + observation.id.toString()
        let api_link = ASTROBASE_URL + "?search_box=" + observation.taskID.toString()
        return api_link
    }

    // generate the api link
    const getDPSlink = (observation) => {
        let dps_link = ASTROBASE_URL + "task/" + observation.taskID.toString()
        return dps_link
    }

    const columns = [

        {
            name: 'TaskID',
            selector: 'taskID',
            sortable: true,
            width: "6%"
        },
        {
            name: 'Observation Date',
            selector: 'date',
            sortable: true,
            width: "8%",
            cell: row => {
                var d = new Date(row.date.toString());
                var n = d.toDateString()
                return <div>{n}</div>
            }
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
            width: "15%",
            cell: row => {
                let icon = getIcon(row.image_type)
                return <div>{icon}&nbsp;&nbsp;{row.name}</div>
            }
        },

        {
            name: 'Field',
            selector: 'field_name',
            sortable: true,
            wrap : true,
            compact: true
        },

        {
            name: 'Mode',
            selector: 'observing_mode',
            sortable: true,
            width: "7%",
            cell: row => {
                let mode = getMode(row)
                return <div>{mode}</div>
            }
        },
        {
            name: 'Secs',
            selector: 'exposure_in_seconds',
            sortable: true,
            width: "4%",
            cell: row => {
                let exposure = getExposure(row)
                return <div>{exposure}</div>
            }
        },
        {
            name: 'Focal',
            selector: 'focal_length',
            sortable: true,
            width: "3%"
        },
        {
            name: 'Quality',
            selector: 'quality',
            sortable: true,
            width: "4%",
        },
        {
            name: 'M',
            selector: 'magnitude',
            sortable: true,
            width: "3%",
            cell: row => {
                return <div>
                    <Badge pill variant="light">
                        {row.magnitude}
                    </Badge></div>
            }
        },
        /*
         {
         name: 'Status',
         selector: 'my_status',
         sortable: true,
         width: "5%"
         },
         */
        {
            name: 'Details',
            cell: row =>
                <Link to={() => getLink(row)}>
                    <Button variant="warning" onClick={() => handleClick(row)}>Details</Button>
                </Link>,

            button: true,
        },
        {
            name: 'Dataproducts',
            sortable: true,
            width: "5%",
            cell: row => {

                if (row.generated_dataproducts.length > 1) {
                    return <a href={getDPSlink(row)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline-info" onClick={() => handleClick(row)}>DPS</Button>
                    </a>
                }
            }
        },
        {
            name: 'Astrobase',
            cell: row =>
                <a href={getAPI(row)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline-info" onClick={() => handleClick(row)}>API</Button>
                </a>,
            button: true,
        },

    ];

    const myTheme = {
        title: {
            fontSize: '22px',
            fontColor: '#FFFFFF',
            backgroundColor: '#363640',
        },
        contextMenu: {
            backgroundColor: '#E91E63',
            fontColor: '#FFFFFF',
        },
        header: {
            fontSize: '12px',
            fontColorActive: 'FFFFFF',
            fontColor: '#FFFFFF',
            backgroundColor: '#363640',
            borderColor: 'rgba(255, 255, 255, .12)',
        },
        rows: {
            fontColor: '#FFFFFF',
            backgroundColor: '#363640',
            borderColor: 'rgba(255, 255, 255, .12)',
            hoverFontColor: 'black',
            hoverBackgroundColor: 'rgba(0, 0, 0, .24)',
        },
        cells: {
            cellPadding: '48px',
        },
        pagination: {
            fontSize: '13px',
            fontColor: '#FFFFFF',
            backgroundColor: '#363640',
            buttonFontColor: '#FFFFFF',
            buttonHoverBackground: 'rgba(255, 255, 255, .12)',
        },
        expander: {
            fontColor: '#FFFFFF',
            backgroundColor: '#363640',
            expanderColor: '#FFFFFF',
        },
        footer: {
            separatorColor: 'rgba(255, 255, 255, .12)',
        },
    };

    const conditionalRowStyles = [
        {
            when: row => row.quality == 'great',
            style: {
                backgroundColor: '#9FFF7F',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },

        },
        {
            when: row => row.quality == 'good',
            style: {
                backgroundColor: '#C0FFC0',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': {
                    cursor: 'pointer',
                },
            },

        },
        {
            when: row => row.quality == 'medium',
            style: {
                backgroundColor: 'lightgrey',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },

        },
        {
            when: row => row.quality == 'bad',
            style: {
                backgroundColor: '#ffddd3',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
        {
            when: row => row.quality == 'simulated',
            style: {
                backgroundColor: 'lightblue',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

    ];

    // this creates an 'expand' icon in front of every row and shows additional information (images)
    const ExpandableComponent = ({ data }) => {

            let children = getChildren(my_state.fetched_observations,data.id)

        return <div>
            <h2>Imaging for {data.name} </h2>
            <p>{data.description}</p>

            <img src={data.derived_sky_plot_image} height={200}/>;
            &nbsp;
            <a href={data.derived_raw_image} target="_blank" rel="noopener noreferrer"><img src={data.derived_raw_image}
                                                                                            height={200}/></a>
            &nbsp;
            <a href={data.derived_annotated_image} target="_blank" rel="noopener noreferrer"><img
                src={data.derived_annotated_image} height={200}/></a>

            <hr />

            <ChildrenGrid data={children}/>
            <hr />
        </div>;
    }
    return (
        <div>
            <DataTable
                columns={columns}
                data={props.data}
                conditionalRowStyles={conditionalRowStyles}
                pagination
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, 100]}
                expandableRows
                expandableRowsComponent={<ExpandableComponent />}
            />
        </div>
    );
}