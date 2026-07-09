import { Row, Col, Card } from "react-bootstrap";
import { TbTrendingUp } from "react-icons/tb";

const StatsCards = ({ stats }) => {
  return (
    <Row className="mb-3 g-2 g-md-3">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <Col 
            key={index}
            xs={6}      
            sm={6}       
            md={2}       
            lg={true}      
            xl={true}     
          >
            <Card className="metric-card h-100">  
              <Card.Body className="metric-body"style={{
    padding: "12px 14px",
  }}>
                <div
  className="metric-top"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
  }}
>
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