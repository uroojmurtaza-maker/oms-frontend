import CustomTable from '../../components/table/table';
import Layout from '../../layout/layout'
import PageHeader from '../../components/page-header/page-header';
import EmployeesListing from '../employees/employee-listing/employee-listing';

const Dashboard = () => {


  return (
    <Layout>
      <EmployeesListing />
    </Layout>
  )
}

export default Dashboard;