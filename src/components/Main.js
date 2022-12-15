import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';
import { NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY } from '../constants';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';

class Main extends Component {
    constructor(){
        super();
        this.state = {
            setting: {},
            satInfo: {},
            satList: [],
            isLoadingList: false
        }
    }
    render() {
        const { isLoadingList, satInfo, satList, setting } = this.state;
        return (
            <Row className='main'>
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList isLoad={isLoadingList}
                                   satInfo={satInfo}
                                   onShowMap={this.showMap} />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        );
    }

    showMap = (selected) => {
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))
    }

    showNearbySatellite = (setting) => {
        // console.log('show nearby')
        //从子组件拿到setting，更新main中的setting
        this.setState({
            isLoadingList: true,
            setting: setting
        })
        //fetch sat list from the server
        this.fetchSatellite(setting);
    }

    fetchSatellite= (setting) => {
        //1. get settings
        //2. send the req to the server and display loading icon
        //3. get the res from the server
        //case1: success -> update satlist, unmount loading icon
        //case2: fail -> inform users, unmount loading icon
        // console.log("fetching")
        const {latitude, longitude, elevation, altitude} = setting;
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true
        });

        axios.get(url)
            .then(response => {
                console.log(response.data)
                this.setState({
                    satInfo: response.data,
                    isLoadingList: false
                })
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
            })
    }
}
export default Main;
