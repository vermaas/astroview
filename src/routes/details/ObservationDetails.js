import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

import { useGlobalReducer } from '../../Store';
import { deg2HMS, deg2DMS} from '../../utils/astro'
import { getUrlAladin, getUrlESASky, getUrlSDSS, getUrlCDSPortal} from '../../utils/skyserver'

import DetailsThumbnail from './DetailsThumbnail'
import ImageCard from '../../components/cards/ImageCard'

import { url } from '../../components/Main'

export default function ObservationDetails(props) {

    // get the observation info from the global state.
    const [ my_state , my_dispatch] = useGlobalReducer()


    function findElement(arr, propName, propValue) {
        for (var i=0; i < arr.length; i++)
            if (arr[i][propName] === propValue)
                return arr[i];
    }

    if (my_state.status === 'unfetched') {
        return null
    }

    // find the current observation in the fetched observations by taskID
    let observation = findElement(my_state.fetched_observations,"taskID",props.taskid)
    let astrometryLink = "http://nova.astrometry.net/status/"+observation.job

    let fov = parseFloat(observation.field_fov) * 3
    if (fov === 0) {
        fov = 60
    }

    // links to various datacenters
    let sdss_image = getUrlSDSS(observation.field_ra.RA, observation.field_dec, observation.field_fov, 300, 300, 'S')
    let url_esa_sky = getUrlESASky(observation.field_ra,observation.field_dec,"J2000",fov,"DSS2 color")
    let url_cds = getUrlCDSPortal(observation.field_ra,observation.field_dec)

    // link to AstroBase REST API
    let api = url + '/' + observation.id.toString()

    let my_status = ''
    if (observation.my_status!=='done') {
        my_status = ' ('+observation.my_status+')'
    }

    return (

        <div>
            <tr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<td><h2>{observation.name} </h2> </td></tr>
            <Container fluid>

                <Row>
                    <Col sm={3} md={3} lg={3}>

                        <Card>
                            <DetailsThumbnail key={observation.taskID} observation = {observation} />
                        </Card>
                            <Card>
                            <Table striped bordered hover size="sm">
                                <tbody>
                                <tr>
                                    <td className="key">RA</td>
                                    <td className="value">{deg2HMS(observation.field_ra)}</td>
                                </tr>
                                <tr>
                                    <td className="key">dec</td>
                                    <td className="value">{deg2DMS(observation.field_dec)}</td>
                                </tr>
                                <tr>
                                    <td className="key">Field of View</td>
                                    <td className="value">{fov}</td>
                                </tr>
                                <tr>
                                    <td className="key">Date</td>
                                    <td className="value">{observation.date}</td>
                                </tr>
                                <tr>
                                    <td className="key">Mode</td>
                                    <td className="value">{observation.observing_mode}</td>
                                </tr>
                                <tr>
                                    <td className="key">Quality</td>
                                    <td className="value">{observation.quality}</td>
                                </tr>
                                <tr>
                                    <td className="key">Data Centers</td>
                                    <td className="value">
                                        <a href={url_esa_sky} target="_blank" rel="noopener noreferrer">ESA</a>&nbsp;
                                        <a href={url_cds} target="_blank" rel="noopener noreferrer">CDS</a>&nbsp;

                                    </td>
                                </tr>
                                <tr>
                                    <td className="key">Astrometry Job</td>
                                    <td className="value"><a href={astrometryLink} target="_blank" rel="noopener noreferrer">{observation.job}</a>&nbsp;</td>

                                </tr>
                                <tr>
                                    <td className="key"><a href="http://uilennest.net:81/astrobase/">AstroBase</a></td>
                                    <td className="value"><a href={api} target="_blank" rel="noopener noreferrer">API</a>
                                    </td>
                                </tr>

                                </tbody>
                            </Table>

                        </Card>
                    </Col>
                    <Col sm={9} md={9} lg={9}>
                        <Card>
                            <ImageCard key={observation.taskID} observation = {observation} />
                        </Card>
                    </Col>

                </Row>

            </Container>

        </div>
    );
}