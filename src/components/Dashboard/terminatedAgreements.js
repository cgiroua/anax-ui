import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import {
  Segment,
  Header,
  Progress,
  Label,
  List,
  Message,
} from 'semantic-ui-react';
import Highlight from 'react-highlight';
require('./pagination.css');

const ITEMS_PER_PAGE = 10;

class TerminatedAgreements extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      activePage: 1,
    };

    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    const pageCount = Math.ceil(this.props.agreements / ITEMS_PER_PAGE);
    console.log('props in mount', this.props);
    let data;
    if (this.props.agreements.length >= ITEMS_PER_PAGE) {
      data = this.props.agreements.slice(0, 10);
    } else {
      data = this.props.agreements;
    }
    console.log('sliced', data);
    this.setState({ pageCount, data});
  }

  prepareNextPage() {
    // Do client-sided pagination instead of server-sided. It would be nice
    //  to eventually implement a server-sided implementation.
    const newState = this.props.agreements.slice(ITEMS_PER_PAGE * (this.state.activePage - 1), ITEMS_PER_PAGE * this.state.activePage + 1);
    this.setState({data: newState});
  }

  handlePageClick(pageNumber) {
    // let offset = Math.ceil(selected * this.props.perPage);
    console.log('page clicked', pageNumber);
    this.setState({activePage: pageNumber}, () => {
      this.prepareNextPage();
    });
  }

  render() {

    let prettyTime = (stamp) => {
      const d = new Date(0);
      d.setUTCSeconds(stamp);

      return moment(d).format('MMMM DD, hh:mm A');
    }

    let archivedView;
    archivedView = _.map(this.state.data, (ag) => {
      return (
        <Segment key={ag.current_agreement_id}>
          <Header size="medium">{ag.current_agreement_id}</Header>
          <Progress percent={40} attached="top" color={'grey'} />
          <Label as="span" color={'grey'} attached="top right">{'Terminated'}</Label>

          <List divided relaxed>
            <List.Item>
              <List.Content>
                <List.Header>
                  Agreement Information
                </List.Header>
                <div style={{'paddingLeft': '2%'}}>
                  <List.Description><strong>Id</strong>: {ag.current_agreement_id}</List.Description>
                  <br />
                  <List.Description><strong>Name</strong>: {ag.name}</List.Description>
                  <List.Description><strong>Sensor URL</strong>: {ag.sensor_url}</List.Description>
                  <List.Description><strong>Consumer ID</strong>: {ag.consumer_id}</List.Description>
                  <List.Description><strong>Counterparty Address</strong>: {ag.counterparty_address}</List.Description>
                  { ag.agreement_creation_time > 0 &&
                    <List.Description><strong>Agreement creation time</strong>: {prettyTime(ag.agreement_creation_time)}</List.Description> }
                  { ag.agreement_accepted_time > 0 &&
                    <List.Description><strong>Agreement accepted time</strong>: {prettyTime(ag.agreement_accepted_time)}</List.Description> }
                  { ag.agreement_finalized_time > 0 &&
                    <List.Description><strong>Agreement finalized time</strong>: {prettyTime(ag.agreement_finalized_time)}</List.Description> }
                  { ag.agreement_terminated_time > 0 &&
                    <List.Description><strong>Agreement terminated time</strong>: {prettyTime(ag.agreement_terminated_time)}</List.Description> }
                  { ag.agreement_force_terminated_time > 0 &&
                    <List.Description><strong>Agreement force terminated time</strong>: {prettyTime(ag.agreement_force_terminated_time)}</List.Description> }
                  { ag.agreement_execution_start_time > 0 &&
                    <List.Description><strong>Agreement execution start time</strong>: {prettyTime(ag.agreement_execution_start_time)}</List.Description> }
                  { ag.agreement_data_received_time > 0 &&
                    <List.Description><strong>Agreement data received time</strong>: {prettyTime(ag.agreement_data_received_time)}</List.Description> }
                  <List.Description><strong>Proposal</strong>: <Highlight className='javascript'>{ag.proposal}</Highlight></List.Description>
                  <List.Description><strong>Proposal Sig</strong>: <Highlight className='javascript'>{ag.proposal_sig}</Highlight></List.Description>
                  <List.Description><strong>Agreement Protocol</strong>: {ag.agreement_protocol}</List.Description>
                  <List.Description><strong>Protocol Version</strong>: {ag.protocol_version}</List.Description>
                  <List.Description><strong>Terminated Reason</strong>: {ag.terminated_reason}</List.Description>
                  <List.Description><strong>Terminated Description</strong>: {ag.terminated_description}</List.Description>
                  { ag.agreement_protocol_terminated_time > 0 &&
                    <List.Description><strong>Agreement Protocol Terminated Time</strong>: {prettyTime(ag.agreement_protocol_terminated_time)}</List.Description> }
                  { ag.workload_terminated_time > 0 &&
                    <List.Description><strong>Workload Terminated Terminated Time</strong>: {prettyTime(ag.workload_terminated_time)}</List.Description> }
                </div>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      )
    });

    return (
      <div>
        {archivedView.length > 0 ?
          <div>
            {archivedView}
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={ITEMS_PER_PAGE}
              totalItemsCount={this.props.agreements.length}
              pageRangeDisplayed={5}
              onChange={this.handlePageClick}
            />
          </div>
          :
          <Message>
            <Message.Header>
              No Data
            </Message.Header>
            <p>There are no terminated agreements. Check back later.</p>
          </Message>
        }
      </div>
    );
  }
}

export default TerminatedAgreements;
