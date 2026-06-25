import { Row, Col, Card } from "react-bootstrap";
import { TbUserStar, TbUserCheck, TbUsers, TbUserCog, TbUserOff, TbUserPlus, TbTrendingUp, TbAlertTriangle, TbDotsVertical, TbDownload } from "react-icons/tb";

const StatsCards = ({ stats }) => {
  return (
    <Row className="mb-2 g-3 g-md-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
         <Col xl lg={4} md={6} sm={6} xs={6}>
             <Card className="metric-card">
               <Card.Body className="metric-body">
          <div className="metric-top">
                        <div
                          className="metric-icon-box"
                          style={{ backgroundColor: item.bgColor, color: item.iconColor }}
                        >
                          <Icon size={20} />
                        </div>
                        <h2 className="metric-number">{item.value}</h2>
                      </div>
           <div className="metric-title">{item.title}</div>
            <div className={item.footerClass}>
                    <TbTrendingUp size={14} />
                    <span><small>{item.footer}</small></span>
            </div>

              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
    
    
  );
};

export default StatsCards;