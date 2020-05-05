const request = require('request');
const { Received_data, Habit, Noti_detail, Doll, Notification } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
   * @swagger
   *  /rasp/:
   *    post:
   *      tags:
   *      - Raspberry
   *      description: 알람 수행 내역 등록
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: is_done
   *        in: formData
   *        type: bull
   *      - name: dollId
   *        in: formData
   *        type: int
   *      - name: notificationId
   *        in: formData
   *        type: int
   *      - name: noti_detailId
   *        in: formData
   *        type: int
   *      - name: time
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: 알람 수행 내역 등록 완료
   *
   *
   * @swagger
   *  /rasp/sync/{dollId}:
   *    post:
   *      tags:
   *      - Raspberry
   *      description: 인형 별 알람 동기화 작업 수행
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: dollId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 인형의 알람과 사용자가 등록한 알람이 모두 일치하다는 메세지 결과
   *
   * @swagger
   *  /rasp/activate/{dollId}:
   *    get:
   *      tags:
   *      - Raspberry
   *      description: 부재중 등의 경우 인형 알람 끄기
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: dollId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 인형 활성화 및 비활성화 상태로 변경
   *
   * @swagger
   *  /rasp/{dollId}/:
   *    delete:
   *      tags:
   *      - Raspberry
   *      description: 인형 공장초기화 시키기
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: dollId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 인형의 정보가 모두 삭제되고 인형이 자동으로 꺼집니다.
   *
   * @swagger
   *  /rasp/web_register/:
   *    post:
   *      tags:
   *      - Raspberry
   *      description: raspberry 기기 등록
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: serialNumber
   *        in: formData
   *        type: int
   *      - name: dollName
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: serialNumber에 따라서 dollName 등록 및 유저 연결
   *
   *
   * @swagger
   *  /rasp/rasp_register/:
   *    post:
   *      tags:
   *      - Raspberry
   *      description: raspberry 기기 등록
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: serialNumber
   *        in: formData
   *        type: int
   *      - name: domain
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: serialNumber에 따라서 domain 등록
   *
   * @swagger
   *  /rasp/update/{dollId}/:
   *    post:
   *      tags:
   *      - Raspberry
   *      description: 인형 이름 변경
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: dollId
   *        in: path
   *        type: int
   *      - name: dollName
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: 인형의 정보가 모두 삭제되고 인형이 자동으로 꺼집니다.
   *
   *
   *
   * @swagger
   *  /rasp/cushion/{serialNumber}/:
   *    post:
   *      tags:
   *      - Raspberry
   *      description: 방석 디비 등록
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: serialNumber
   *        in: path
   *        type: string
   *
   *      responses:
   *       200:
   *        description:
   *
   */

  toggle_activate: async (req, res, next) => {
    try {
      const doll = await Doll.findByPk(req.params.dollId);
      
      await request.post({
        url: doll.domain + '/habit/all/activate/',
        body: {is_activated: doll.is_activated},
        json: true,
      }, function (err, response, body) {
        if (err) {
          console.error(err);
          return res.status(403).json({
            message: '인형 설정 변경은 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        }
        if (response && response.statusCode === 200) {
          doll.is_activated ? doll.is_activated = false : doll.is_activated = true;
          doll.save();
          
          if (doll.is_activated) {
            return res.status(200).json({
              message: '인형의 알람이 활성화 되었습니다.'
            })
          } else {
            return res.status(200).json({
              message: '인형의 알람이 비활성화 되었습니다.'
            })
          }
        } else {
          return res.status(400).json({
            message: '인형과의 연결이 불안정합니다. 연결을 확인해주세요.'
          })
        }
      });
    } catch (error) {
     console.error(error);
     next(error);
    }
  },

  rasp_sync: async (req, res, next) => {
    try {
      const doll = await Doll.findByPk(req.params.dollId);

      if (doll) {
        if (doll.userId === req.user.id) {

          const habitSet = await Habit.findAll({
            attributes: ['id'],
            where: {userId: req.user.id},
            raw: true,
          });

          const habitIdSet = await habitSet.map(data => data.id);

          const notificationSet = await Notification.findAll({
            attributes: ['id'],
            where: {
              habitId: { [Op.or]: habitIdSet },
              dollId: req.params.dollId,
            }
          });

          const notiIdSet = await notificationSet.map(data => data.id);

          const noti_detail = await Noti_detail.findAll({
            attributes: {exclude: ['cnt']},
            where: {
              notificationId: {[Op.or]: notiIdSet },
            },
          });

          await request.post({
            url: doll.domain + '/alarm/sync/',
            body: noti_detail,
            json: true,
          }, function (err, response, body) {
            if (err) {
              console.error(err);
              return res.status(403).json({
                message: '알람 동기화는 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
              })
            }
            if (response && response.statusCode === 200) {
              return res.status(200).json({
                message: '설정한 알람과 인형의 알람 정보가 모두 일치합니다.'
              })
            } else {
              return res.status(403).json({
                message: '인형과의 연결이 불안정 합니다. 연결을 확인한 뒤, 동기화 버튼을 다시 클릭해주세요.'
              })
            }
          })
        } else {
          return res.status(403).json({
            message: '유효하지 않은 접근입니다.'
          })
        }
      } else {
        return res.status(403).json({
          message: '존재하지 않는 인형입니다. 인형 등록을 먼저 해주세요.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  create_received_data: async (req, res, next) => {
    try {
      const { is_done, dollId, notificationId, time, notiDetailId } = req.body;
      await Received_data.create({
        is_done,
        dollId,
        notificationId,
        time,
        notiDetailId,
      });
      res.status(200).json({
        message: '데이터 저장 완료'
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  register_device_from_rasp: async (req, res, next) => {
    const { serialNumber, domain } = req.body;
    try {
      let doll = await Doll.findOne({ where: { serialNumber: serialNumber } });

      if (doll) {
        if (doll.dollName) {
          doll.domain = domain;
          doll.save();
          return res.status(200).json({
            message: '도메인 업데이트 완료(from rasp).'
          })
        }
        return res.status(200).json({
          message: '이미 등록된 도메인입니다. 웹에서 인형 등록을 진행해주세요.'
        });
      } else {
        return res.status(403).json({
          message: '존재하지 않는 인형입니다.'
        })
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  register_device_from_web: async (req, res, next) => {
    const { serialNumber, dollName } = req.body;
    try {
     let doll = await Doll.findOne({ where: { serialNumber: serialNumber } });
     if (doll) {
        if (doll.domain) {
          if (doll.dollName === null) {
            if (dollName) {
              doll.dollName = dollName;
              doll.userId = req.user.id;
              doll.save();
              return res.status(200).json({
                message: '인형이 정상 등록되었습니다.'
              })
            } else {
              return res.status(403).json({
                message: '인형을 등록하기 위한 데이터가 부족합니다.'
              })
            }
          } else {
            if (doll.userId === req.user.id) {
              if (dollName) {
                doll.dollName = dollName;
                doll.userId = req.user.id;
                doll.save();
                return res.status(200).json({
                  message: '인형의 이름이 정상 변경되었습니다.'
                })
              } else {
                return res.status(403).json({
                  message: '인형의 이름을 변경하기 위한 데이터가 부족합니다.'
                })
              }
            } else {
              return res.status(403).json({
                message: '이미 등록 된 인형입니다. 시리얼 번호를 다시 확인해주세요.'
              })
            }
          }
        } else {
          return res.status(403).json({
            message: '인형의 전원을 켜고, 시계가 켜졌음을 확인해주세요.'
          });
        }
     } else {
       return res.status(403).json({
         message: '존재하지 않는 인형입니다. 시리얼 번호를 확인해주세요.'
       })
     }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  delete_all: async(req, res, next) => {
    try {
      const doll = await Doll.findByPk(req.params.dollId);

      if (doll.userId === req.user.id) {
        await request.delete({
          url: doll.domain + '/delete/all/',
        }, async function (err, response, body) {
          if (err) {
            console.error(err);
            return res.status(403).json({
              message: '인형 초기화는 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
            })
          }
          if (response && response.statusCode === 200) {
            const temp = doll.serialNumber;
            await doll.destroy();
            await Doll.create({
              serialNumber: temp,
            });
            return res.status(200).json({
              message: '인형이 초기화 되고, 자동으로 종료됩니다.'
            })
          } else {
            return res.status(403).json({
              message: '인형과의 연결이 불안정합니다. 연결을 확인해주세요.'
            })
          }
        });
      } else {
        return res.status(403).json({
          message: '권한이 없습니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  cushion_create: async (req, res, next) => {
    try {
      const serialNumber = req.params.serialNumber;
      const doll = await Doll.findOne({
        where: { serialNumber }
      });
      // const device = await Device.findByPk(1);

      doll.addMachine(1);

      return res.status(200).json({
        doll,
        message: '방석과 인형 디비 등록 완료'
      })

    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  update_dollName: async (req, res, next) => {
    try {
      const doll = await Doll.findByPk(req.params.dollId);
      if (doll) {
        if (req.user.id === doll.userId) {
          const { dollName } = req.body;
          doll.dollName = dollName;
          doll.save();
          return res.status(200).json({
            message: '인형 정보가 수정 되었습니다.'
          })
        } else {
          return res.status(403).json({
            message: '권한이 없습니다.'
          })
        }
      } else {
        return res.status(403).json({
          message: '존재하지 않는 인형입니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

};