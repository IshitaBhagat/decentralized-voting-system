import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Table} from 'semantic-ui-react';
import { Link } from '../../../routes';
import EventVoting from '../../../ethereum/events';
import TeamRow from '../../../components/TeamRow';
import web3 from '../../../ethereum/web3';
class TeamIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const event_vote = EventVoting(address);
        const teamsCount = await event_vote.methods.getTeamsCount().call();
        //const registeredVotesCount = await event_vote.methods.registerdvoters_count().call();

        const teams = await Promise.all(
            Array(parseInt(teamsCount)).fill().map((element, index) => {
                    return event_vote.methods.teams(index).call();
                })
        );

        console.log(teams);
        return { address, teams, teamsCount };
    }

    renderTeamRow() {
        return this, this.props.teams.map((team, index) => {
            return <TeamRow
                key={index}
                id={index}
                team={team}
                address={this.props.address}
            //registeredVotesCount = {this.props.registeredVotesCount}
            />
        })
    }

    onClose = async () => {
        const event_vote = EventVoting(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await event_vote.methods.close_voting().send({from:accounts[0]});
    };

    render() {
        //es25tH DESTRUCTURING :
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h1><center>Teams List</center></h1>
                <Link route={`/events/${this.props.address}/teams/new`}>
                    <a>
                        <Button primary >Add your team !</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Name</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Votes Count</HeaderCell>
                            <HeaderCell>Vote</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderTeamRow()}
                    </Body>
                </Table>
                <div><h2>Number of teams currently : {this.props.teamsCount} .</h2></div>
                <h1>In order to close voting poll in this event !</h1>
                <Button color="teal" floated='right' onClick={this.onClose}>Close Voting!</Button>
            </Layout>
        );
    }
}

export default TeamIndex;