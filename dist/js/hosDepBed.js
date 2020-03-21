const baseURL="http://ep.ebmtech.com:9006/api/",token=localStorage.getItem("token"),authorizationToken=`bearer ${token}`;let hosDepBed={};function checkLogIn(){null===localStorage.getItem("token")&&(window.location.href="./login.html")}function logOut(){localStorage.removeItem("token"),window.location.href="./login.html"}function getData(t){const e=baseURL+t;return new Promise((t,s)=>{$.ajax({url:e,dataType:"json",type:"GET",beforeSend(t){t.setRequestHeader("Authorization",authorizationToken)},success(e){t(e)},error(t){s(t)}})})}function getHosDepBed(){Promise.resolve(getData("HosDepBedR")).then(t=>{showHosDepBed(hosDepBed=t),$(".side-nav--item:nth-child(2)").trigger("click")}).catch(t=>{console.log(t)})}function showHosDepBed(t){for(const e of t)$(".side-nav--body").append(`<li class="side-nav--item" onClick=loadAdmissionStatusByWard(this)>${e.WName}</li>`)}function loadAdmissionStatusByWard(t){refreshSideNavUI(t),showWardAdmissionStatusLoadingUI();const e=t.innerHTML;getAdmissionStatusByWard(`AdmissionStatus/${findHWID(e)}`,e)}function refreshSideNavUI(t){$(".side-nav--body .side-nav--item").removeClass("side-nav--item__clicked"),$(t).addClass("side-nav--item__clicked")}function showWardAdmissionStatusLoadingUI(){$(".content--header").html('<img class="spinner" src="images/spinner.gif" alt="loading">'),$(".content--body").html('<div class="spinner-wrap"><img class="spinner" src="images/spinner.gif" alt="loading"></div>')}function findHWID(t){let e="";for(const s of hosDepBed)t===s.WName&&(e=s.HWID);return e}function getAdmissionStatusByWard(t,e){Promise.resolve(getData(t)).then(t=>{showAdmissionStatus(t,e)}).catch(t=>{showAdmissionStatus(null,e),console.log(t)})}function showAdmissionStatus(t,e){$(".content--body *").remove(),$(".content--header").text(e),t?(showAdmissionStatusTableHead(),showAdmissionStatusTableData(t)):$(".content--body").append('<i class="no-data">--- 尚無資料 ---</i>')}function showAdmissionStatusTableHead(){$(".content--body").append('<table class="admission-status"></table>'),$(".admission-status").append('<tr class="admission-status--head">\n        <th>科別</th>\n        <th>病床號碼</th>\n        <th>病患資料</th>\n        <th>住院日期</th>\n        </tr>')}function showAdmissionStatusTableData(t){if(t.length>0)for(const e of t)$(".admission-status").append(`<tr class=admission-status--data data-aid=${e.AID} onClick="loadPatientData(this)">\n                    <td>${e.DepName}</td>\n                    <td>${e.WardNo}</td>\n                    <td>\n                        <span class="patient-name">${e.CNM}</span>\n                    </td>\n                    <td>${e.InHosDate}</td>\n                </tr>`);else $(".content--body").append('<i class="no-data">--- 尚無資料 ---</i>')}$(document).ready(()=>{checkLogIn(),getHosDepBed()});let patientAID="";function loadPatientData(t){refreshAdmissionStatusUI(t),showPatientsAdmisstionLoadingUI();const e=$(t).data("aid");patientAID=e;getPatientAdmissionData(`PatientInfoR?id=${e}`,"AdmissionStatus",e)}function refreshAdmissionStatusUI(t){$(".admission-status--data").removeClass("admission-status--data__clicked"),$(t).addClass("admission-status--data__clicked")}function showPatientsAdmisstionLoadingUI(){$(".patient-info").html('<div class="spinner-wrap">\n        <img  class="spinner" src="images/spinner.gif" alt="loading">\n        </div>')}function getPatientAdmissionData(t,e,s){let i={},n={};Promise.all([getData(t),getData(e)]).then(t=>{i=t[0];const e=t[1];return n=findAdmissionStatus(e,s),getData(`NISTPR?id=${s}&startDate=${n.InHosDate}`)}).then(t=>{showPatientsAdmissionData(generatePatientsAdmissionData(i,n,t),s)}).catch(t=>{$(".patient-info").html('<i class="no-data no-data--admission">--- 尚無住院資料 ---</i>'),console.log(t)})}function findAdmissionStatus(t,e){for(const s of t)if(s.AID==e)return s;return null}function generatePatientsAdmissionData(t,e,s){const i={};if(i.CNM=t.CNM,i.GENDER=0==t.Gender?"男":"女",i.age=t.age,i.IDNO=t.IDNO,i.nisTopRecords="",jQuery.isEmptyObject(s))i.nisTopRecords="<li><i>---尚無資料---</i></li>";else for(const t of s)i.nisTopRecords+=`<li>\n            <span>${t.Item}</span>\n            <span>${t.Value}</span>\n            <span>${t.DateTime}</span>\n            </li>`;return i.ProblemNotes=interpretJsonString(e.ProblemNotes),i.CatastrophicIllness=interpretJsonString(e.CatastrophicIllness),i.Allergy=interpretJsonString(e.Allergy),i.SpecialNotes=interpretJsonString(e.SpecialNotes),i.Notes=interpretJsonString(e.Notes),i}function showPatientsAdmissionData(t,e){$(".patient-info").html('<div class="patient-info"> <div class="patient-info--head"> <div> <h2 id="patient-name">Name</h2> <p id="patient-gender-and-age">Gender, Age</p> </div> <p id="patient-ID">ID number</p> </div> <div class="patient-info--body"> <div class="patient-report-area"> <div class="patient-report--btn" data-temp-code="Ad001">查房首頁</div> <div class="patient-report--btn" data-temp-code="Ad002">住院病患資訊</div> <div class="patient-report--btn" data-temp-code="Ad003">住院診斷</div> <div class="patient-report--btn" data-temp-code="Ad004">檢驗報告</div> <div class="patient-report--btn" data-temp-code="Ad005">DDC報告</div> <div class="patient-report--btn" data-temp-code="Ad006">病理報告</div> <div class="patient-report--btn" data-temp-code="Ad007"">檢查報告</div> <div class="patient-report--btn" data-temp-code="Ad008">生理報告</div> <div class="patient-report--btn" data-temp-code="Ad009">住院醫囑長期醫令</div> <div class="patient-report--btn" data-temp-code="Ad010">住院醫囑即時醫令</div> <div class="patient-report--btn" data-temp-code="Ad011">病歷摘要入院病摘</div> <div class="patient-report--btn" data-temp-code="Ad012">病歷摘要住院病摘</div> <div class="patient-report--btn" data-temp-code="Ad013">病歷摘要出院病摘</div> <div class="patient-report--btn" data-temp-code="Ad014">放射科報告</div> <div class="patient-report--btn" data-temp-code="Ad015">會診紀錄</div> <div class="patient-report--btn" data-temp-code="Ad016">歷史就醫紀錄</div> </div> <div class="nistpr-area"> <p class="problem-title">生命徵象</p> <ul class="nistpr-list"> <li><i>---尚無資料---</i></li> </ul> </div> <ul class="patient-notes"> <li> <p class="problem-title">問題註記</p> <ul class="problem-notes" id="problem-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">重大疾病</p> <ul class="problem-notes" id="catastrophic-illness-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">過敏紀錄</p> <ul class="problem-notes" id="allergy-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">特殊註記</p> <ul class="problem-notes" id="special-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">註記</p> <ul class="problem-notes" id="other-notes"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> </ul> </div> </div>'),generateReportButton(e),$("#patient-name").text(t.CNM),$("#patient-gender-and-age").text(`${t.GENDER}, ${t.age}歲`),$("#patient-ID").text(t.IDNO),$(".nistpr-list").html(t.nisTopRecords),$("#problem-note").html(t.ProblemNotes),$("#catastrophic-illness-note").html(t.CatastrophicIllness),$("#allergy-note").html(t.Allergy),$("#special-note").html(t.SpecialNotes),$("#other-notes").html(t.Notes)}function interpretJsonString(t){if(!t)return'<li class="problem-note"><div class="problem-note-detail-group"><i>---尚無資料---</i></div></li>';const e=JSON.parse(t);let s="";for(const t of e){const e=Object.keys(t);s+='<li class="problem-note"><div class="problem-note-detail-group">';for(const i of e)s+=`<div><span>${i}: </span>`+`<span>${t[i]} </span></div>`;s+="</div></li>"}return s}function generateReportButton(t){for(let e=0;e<16;e++){const s=`0${e+1}`.slice(-2);getData(`DocumentIndexesR/${t}?p=${`Ad0${s}`}`).then(()=>{$(`.patient-report--btn:nth-child(${e+1})`).on("click",e=>{const{tempCode:s}=e.target.dataset;showReport(s,t)})}).catch(()=>{$(`.patient-report--btn:nth-child(${e+1})`).addClass("patient-report--btn__disable")})}}function showReport(t,e){window.open(`report.html?AID=${e}&tempCode=${t}`)}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvc0RlcEJlZC5qcyJdLCJuYW1lcyI6WyJiYXNlVVJMIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiYXV0aG9yaXphdGlvblRva2VuIiwiaG9zRGVwQmVkIiwiY2hlY2tMb2dJbiIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImxvZ091dCIsInJlbW92ZUl0ZW0iLCJnZXREYXRhIiwiYXBpVVJMIiwiY29tcGxldGVkVVJMIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCIkIiwiYWpheCIsInVybCIsImRhdGFUeXBlIiwidHlwZSIsIltvYmplY3QgT2JqZWN0XSIsInJlcXVlc3QiLCJzZXRSZXF1ZXN0SGVhZGVyIiwicmVzcG9uc2UiLCJlcnIiLCJnZXRIb3NEZXBCZWQiLCJ0aGVuIiwic2hvd0hvc0RlcEJlZCIsInRyaWdnZXIiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImRlcEJlZCIsImFwcGVuZCIsIldOYW1lIiwibG9hZEFkbWlzc2lvblN0YXR1c0J5V2FyZCIsIndhcmQiLCJyZWZyZXNoU2lkZU5hdlVJIiwic2hvd1dhcmRBZG1pc3Npb25TdGF0dXNMb2FkaW5nVUkiLCJpbm5lckhUTUwiLCJnZXRBZG1pc3Npb25TdGF0dXNCeVdhcmQiLCJmaW5kSFdJRCIsIml0ZW0iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsIkhXSUQiLCJzaG93QWRtaXNzaW9uU3RhdHVzIiwiYWxsQWRtaXNzaW9uU3RhdHVzIiwicmVtb3ZlIiwidGV4dCIsInNob3dBZG1pc3Npb25TdGF0dXNUYWJsZUhlYWQiLCJzaG93QWRtaXNzaW9uU3RhdHVzVGFibGVEYXRhIiwibGVuZ3RoIiwiYWRtaXNzaW9uU3RhdHVzIiwiQUlEIiwiRGVwTmFtZSIsIldhcmRObyIsIkNOTSIsIkluSG9zRGF0ZSIsImRvY3VtZW50IiwicmVhZHkiLCJwYXRpZW50QUlEIiwibG9hZFBhdGllbnREYXRhIiwicGF0aWVudCIsInJlZnJlc2hBZG1pc3Npb25TdGF0dXNVSSIsInNob3dQYXRpZW50c0FkbWlzc3Rpb25Mb2FkaW5nVUkiLCJkYXRhIiwiZ2V0UGF0aWVudEFkbWlzc2lvbkRhdGEiLCJsaXN0SXRlbSIsInBhdGllbnRJbmZvVVJMIiwiYWRtaXNzaW9uU3RhdHVzVVJMIiwicGF0aWVudEluZm8iLCJhbGwiLCJmaW5kQWRtaXNzaW9uU3RhdHVzIiwibmlzVG9wUmVjb3JkcyIsInNob3dQYXRpZW50c0FkbWlzc2lvbkRhdGEiLCJnZW5lcmF0ZVBhdGllbnRzQWRtaXNzaW9uRGF0YSIsImFkbWlzc3Rpb25TdGF0dXMiLCJwYXRpZW50c0FkbWlzc2lvbkRhdGEiLCJHRU5ERVIiLCJHZW5kZXIiLCJhZ2UiLCJJRE5PIiwialF1ZXJ5IiwiaXNFbXB0eU9iamVjdCIsIm5pc1RvcFJlY29yZCIsIkl0ZW0iLCJWYWx1ZSIsIkRhdGVUaW1lIiwiUHJvYmxlbU5vdGVzIiwiaW50ZXJwcmV0SnNvblN0cmluZyIsIkNhdGFzdHJvcGhpY0lsbG5lc3MiLCJBbGxlcmd5IiwiU3BlY2lhbE5vdGVzIiwiTm90ZXMiLCJnZW5lcmF0ZVJlcG9ydEJ1dHRvbiIsImpzb25TdHJpbmciLCJqc29uT2JqZWN0IiwiSlNPTiIsInBhcnNlIiwicmVzdWx0Iiwic3ViT2JqZWN0Iiwic3ViT2JqZWN0S2V5cyIsIk9iamVjdCIsImtleXMiLCJzdWJPYmplY3RLZXkiLCJpIiwidHdvRGlnaXROdW1iZXIiLCJzbGljZSIsIm9uIiwiZSIsInRlbXBDb2RlIiwidGFyZ2V0IiwiZGF0YXNldCIsInNob3dSZXBvcnQiLCJvcGVuIl0sIm1hcHBpbmdzIjoiQUFDQSxNQUFNQSxRQUFVLGtDQUNWQyxNQUFRQyxhQUFhQyxRQUFRLFNBQzdCQyw2QkFBK0JILFFBQ3JDLElBQUlJLFVBQVksR0FRaEIsU0FBU0MsYUFDK0IsT0FBbENKLGFBQWFDLFFBQVEsV0FDdkJJLE9BQU9DLFNBQVNDLEtBQU8sZ0JBSTNCLFNBQVNDLFNBQ1BSLGFBQWFTLFdBQVcsU0FDeEJKLE9BQU9DLFNBQVNDLEtBQU8sZUFHekIsU0FBU0csUUFBUUMsR0FDZixNQUFNQyxFQUFlZCxRQUFVYSxFQUMvQixPQUFPLElBQUlFLFFBQVEsQ0FBRUMsRUFBU0MsS0FDNUJDLEVBQUVDLEtBQUssQ0FDTEMsSUFBS04sRUFDTE8sU0FBVSxPQUNWQyxLQUFNLE1BQ05DLFdBQVdDLEdBQ1RBLEVBQVFDLGlCQUFpQixnQkFBaUJyQixxQkFFNUNtQixRQUFRRyxHQUNOVixFQUFRVSxJQUVWSCxNQUFNSSxHQUNKVixFQUFPVSxRQU1mLFNBQVNDLGVBQ1diLFFBQVFDLFFBQVFKLFFBQVEsZUFDaENpQixLQUFNSCxJQUVkSSxjQURBekIsVUFBWXFCLEdBRVpSLEVBQUUsZ0NBQWdDYSxRQUFRLFdBQ3pDQyxNQUFPQyxJQUNSQyxRQUFRQyxJQUFJRixLQUloQixTQUFTSCxjQUFjekIsR0FDckIsSUFBSyxNQUFNK0IsS0FBVS9CLEVBQ25CYSxFQUFFLG1CQUFtQm1CLDZFQUNtREQsRUFBT0UsY0FLbkYsU0FBU0MsMEJBQTBCQyxHQUNqQ0MsaUJBQWlCRCxHQUNqQkUsbUNBQ0EsTUFBTUosRUFBUUUsRUFBS0csVUFHbkJDLDRDQUZhQyxTQUFTUCxLQUVXQSxHQUduQyxTQUFTRyxpQkFBaUJLLEdBQ3hCNUIsRUFBRSxtQ0FBbUM2QixZQUFZLDJCQUNqRDdCLEVBQUU0QixHQUFNRSxTQUFTLDJCQUduQixTQUFTTixtQ0FDUHhCLEVBQUUsb0JBQW9CK0IsS0FBSyxnRUFDM0IvQixFQUFFLGtCQUFrQitCLEtBQUssZ0dBRzNCLFNBQVNKLFNBQVNQLEdBQ2hCLElBQUlZLEVBQU8sR0FDWCxJQUFLLE1BQU1kLEtBQVUvQixVQUNmaUMsSUFBVUYsRUFBT0UsUUFDbkJZLEVBQU9kLEVBQU9jLE1BR2xCLE9BQU9BLEVBR1QsU0FBU04seUJBQXlCL0IsRUFBUXlCLEdBQ2J2QixRQUFRQyxRQUFRSixRQUFRQyxJQUNoQ2dCLEtBQU1ILElBQ3ZCeUIsb0JBQW9CekIsRUFBVVksS0FDN0JOLE1BQU9DLElBQ1JrQixvQkFBb0IsS0FBTWIsR0FDMUJKLFFBQVFDLElBQUlGLEtBSWhCLFNBQVNrQixvQkFBb0JDLEVBQW9CZCxHQUMvQ3BCLEVBQUUsb0JBQW9CbUMsU0FDdEJuQyxFQUFFLG9CQUFvQm9DLEtBQUtoQixHQUN0QmMsR0FHSEcsK0JBQ0FDLDZCQUE2QkosSUFIN0JsQyxFQUFFLGtCQUFrQm1CLE9BQU8sdUNBTy9CLFNBQVNrQiwrQkFDUHJDLEVBQUUsa0JBQWtCbUIsT0FBTyw0Q0FDM0JuQixFQUFFLHFCQUFxQm1CLE9BQ3JCLGdKQVNKLFNBQVNtQiw2QkFBNkJKLEdBQ3BDLEdBQUlBLEVBQW1CSyxPQUFTLEVBQzlCLElBQUssTUFBTUMsS0FBbUJOLEVBQzVCbEMsRUFBRSxxQkFBcUJtQixvREFDd0JxQixFQUFnQkMsaUVBQzNDRCxFQUFnQkUseUNBQ2hCRixFQUFnQkcsNkZBRVdILEVBQWdCSSxrRUFFM0NKLEVBQWdCSyw4Q0FLdEM3QyxFQUFFLGtCQUFrQm1CLE9BQU8sdUNBckkvQm5CLEVBQUU4QyxVQUFVQyxNQUFNLEtBQ2hCM0QsYUFDQXNCLGlCQXdJRixJQUFJc0MsV0FBYSxHQUVqQixTQUFTQyxnQkFBZ0JDLEdBQ3ZCQyx5QkFBeUJELEdBQ3pCRSxrQ0FDQSxNQUFNWCxFQUFNekMsRUFBRWtELEdBQVNHLEtBQUssT0FDNUJMLFdBQWFQLEVBR2JhLDJDQUYwQ2IsSUFDZixrQkFDaUNBLEdBRzlELFNBQVNVLHlCQUF5QkksR0FDaEN2RCxFQUFFLDJCQUEyQjZCLFlBQVksbUNBQ3pDN0IsRUFBRXVELEdBQVV6QixTQUFTLG1DQUd2QixTQUFTc0Isa0NBQ1BwRCxFQUFFLGlCQUFpQitCLEtBQ2pCLHFIQU1KLFNBQVN1Qix3QkFBd0JFLEVBQWdCQyxFQUFvQmhCLEdBQ25FLElBQUlpQixFQUFjLEdBQ2RsQixFQUFrQixHQUN0QjNDLFFBQVE4RCxJQUFJLENBQUNqRSxRQUFROEQsR0FBaUI5RCxRQUFRK0QsS0FBc0I5QyxLQUFNSCxJQUN4RWtELEVBQWNsRCxFQUFTLEdBQ3ZCLE1BQU0wQixFQUFxQjFCLEVBQVMsR0FHcEMsT0FGQWdDLEVBQWtCb0Isb0JBQW9CMUIsRUFBb0JPLEdBRW5EL0MscUJBRDhCK0MsZUFBaUJELEVBQWdCSyxlQUVyRWxDLEtBQU1rRCxJQUVQQywwQkFEOEJDLDhCQUE4QkwsRUFBYWxCLEVBQWlCcUIsR0FDekNwQixLQUNoRDNCLE1BQU9DLElBQ1JmLEVBQUUsaUJBQWlCK0IsS0FBSyw0REFDeEJmLFFBQVFDLElBQUlGLEtBSWhCLFNBQVM2QyxvQkFBb0IxQixFQUFvQk8sR0FDL0MsSUFBSyxNQUFNdUIsS0FBb0I5QixFQUM3QixHQUFJOEIsRUFBaUJ2QixLQUFPQSxFQUMxQixPQUFPdUIsRUFHWCxPQUFPLEtBR1QsU0FBU0QsOEJBQThCTCxFQUFhbEIsRUFBaUJxQixHQUNuRSxNQUFNSSxFQUF3QixHQVE5QixHQU5BQSxFQUFzQnJCLElBQU1jLEVBQVlkLElBQ3hDcUIsRUFBc0JDLE9BQWdDLEdBQXRCUixFQUFZUyxPQUFlLElBQU0sSUFDakVGLEVBQXNCRyxJQUFNVixFQUFZVSxJQUN4Q0gsRUFBc0JJLEtBQU9YLEVBQVlXLEtBRXpDSixFQUFzQkosY0FBZ0IsR0FDakNTLE9BQU9DLGNBQWNWLEdBVXhCSSxFQUFzQkosY0FBZ0Isa0NBVHRDLElBQUssTUFBTVcsS0FBZ0JYLEVBQ3pCSSxFQUFzQkosMENBRVJXLEVBQWFDLGtDQUNiRCxFQUFhRSxtQ0FDYkYsRUFBYUcscUNBYS9CLE9BTkFWLEVBQXNCVyxhQUFlQyxvQkFBb0JyQyxFQUFnQm9DLGNBQ3pFWCxFQUFzQmEsb0JBQXNCRCxvQkFBb0JyQyxFQUFnQnNDLHFCQUNoRmIsRUFBc0JjLFFBQVVGLG9CQUFvQnJDLEVBQWdCdUMsU0FDcEVkLEVBQXNCZSxhQUFlSCxvQkFBb0JyQyxFQUFnQndDLGNBQ3pFZixFQUFzQmdCLE1BQVFKLG9CQUFvQnJDLEVBQWdCeUMsT0FFM0RoQixFQUdULFNBQVNILDBCQUEwQkcsRUFBdUJ4QixHQUN4RHpDLEVBQUUsaUJBQWlCK0IsS0FBSyxtOUVBRXhCbUQscUJBQXFCekMsR0FFckJ6QyxFQUFFLGlCQUFpQm9DLEtBQUs2QixFQUFzQnJCLEtBQzlDNUMsRUFBRSwyQkFBMkJvQyxRQUFRNkIsRUFBc0JDLFdBQVdELEVBQXNCRyxRQUM1RnBFLEVBQUUsZUFBZW9DLEtBQUs2QixFQUFzQkksTUFFNUNyRSxFQUFFLGdCQUFnQitCLEtBQUtrQyxFQUFzQkosZUFDN0M3RCxFQUFFLGlCQUFpQitCLEtBQUtrQyxFQUFzQlcsY0FDOUM1RSxFQUFFLDhCQUE4QitCLEtBQUtrQyxFQUFzQmEscUJBQzNEOUUsRUFBRSxpQkFBaUIrQixLQUFLa0MsRUFBc0JjLFNBQzlDL0UsRUFBRSxpQkFBaUIrQixLQUFLa0MsRUFBc0JlLGNBQzlDaEYsRUFBRSxnQkFBZ0IrQixLQUFLa0MsRUFBc0JnQixPQUcvQyxTQUFTSixvQkFBb0JNLEdBRTNCLElBQUtBLEVBQ0gsTUFGb0IsK0ZBSXRCLE1BQU1DLEVBQWFDLEtBQUtDLE1BQU1ILEdBQzlCLElBQUlJLEVBQVMsR0FDYixJQUFLLE1BQU1DLEtBQWFKLEVBQVksQ0FDbEMsTUFBTUssRUFBZ0JDLE9BQU9DLEtBQUtILEdBQ2xDRCxHQUFVLG1FQUNWLElBQUssTUFBTUssS0FBZ0JILEVBQ3pCRixpQkFBd0JLLHNCQUNDSixFQUFVSSxtQkFFckNMLEdBQVUsY0FFWixPQUFPQSxFQUdULFNBQVNMLHFCQUFxQnpDLEdBRTVCLElBQUssSUFBSW9ELEVBQUksRUFBR0EsRUFBSSxHQUFJQSxJQUFLLENBQzNCLE1BQU1DLE1BQXNCRCxFQUFJLElBQUtFLE9BQU8sR0FHNUNyRyw0QkFEa0QrQyxhQUQzQnFELE9BRVFuRixLQUFLLEtBQ2xDWCxvQ0FBcUM2RixFQUFJLE1BQU9HLEdBQUcsUUFBVUMsSUFDM0QsTUFBTUMsU0FBRUEsR0FBYUQsRUFBRUUsT0FBT0MsUUFDOUJDLFdBQVdILEVBQVV6RCxPQUV0QjNCLE1BQU0sS0FDUGQsb0NBQXFDNkYsRUFBSSxNQUFPL0QsU0FBUyxtQ0FNL0QsU0FBU3VFLFdBQVdILEVBQVV6RCxHQUM1QnBELE9BQU9pSCx3QkFBd0I3RCxjQUFnQnlEIiwiZmlsZSI6Imhvc0RlcEJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgYmFzZVVSTCA9ICdodHRwOi8vZXAuZWJtdGVjaC5jb206OTAwNi9hcGkvJztcbmNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XG5jb25zdCBhdXRob3JpemF0aW9uVG9rZW4gPSBgYmVhcmVyICR7dG9rZW59YDtcbmxldCBob3NEZXBCZWQgPSB7fTtcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICBjaGVja0xvZ0luKCk7XG4gIGdldEhvc0RlcEJlZCgpO1xufSk7XG5cbi8vIGlzIGl0IGEgZ29vZCB3YXk/XG5mdW5jdGlvbiBjaGVja0xvZ0luKCkge1xuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJykgPT09IG51bGwpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2xvZ2luLmh0bWwnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZ091dCgpIHtcbiAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJyk7XG4gIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vbG9naW4uaHRtbCc7XG59XG5cbmZ1bmN0aW9uIGdldERhdGEoYXBpVVJMKSB7XG4gIGNvbnN0IGNvbXBsZXRlZFVSTCA9IGJhc2VVUkwgKyBhcGlVUkw7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IGNvbXBsZXRlZFVSTCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICB0eXBlOiAnR0VUJyxcbiAgICAgIGJlZm9yZVNlbmQocmVxdWVzdCkge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBhdXRob3JpemF0aW9uVG9rZW4pO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9LFxuICAgICAgZXJyb3IoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBnZXRIb3NEZXBCZWQoKSB7XG4gIGNvbnN0IGhvc0RlcEJhZCA9IFByb21pc2UucmVzb2x2ZShnZXREYXRhKCdIb3NEZXBCZWRSJykpO1xuICBob3NEZXBCYWQudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICBob3NEZXBCZWQgPSByZXNwb25zZTtcbiAgICBzaG93SG9zRGVwQmVkKGhvc0RlcEJlZCk7XG4gICAgJCgnLnNpZGUtbmF2LS1pdGVtOm50aC1jaGlsZCgyKScpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dIb3NEZXBCZWQoaG9zRGVwQmVkKSB7XG4gIGZvciAoY29uc3QgZGVwQmVkIG9mIGhvc0RlcEJlZCkge1xuICAgICQoJy5zaWRlLW5hdi0tYm9keScpLmFwcGVuZChcbiAgICAgIGA8bGkgY2xhc3M9XCJzaWRlLW5hdi0taXRlbVwiIG9uQ2xpY2s9bG9hZEFkbWlzc2lvblN0YXR1c0J5V2FyZCh0aGlzKT4ke2RlcEJlZC5XTmFtZX08L2xpPmAsXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2FkQWRtaXNzaW9uU3RhdHVzQnlXYXJkKHdhcmQpIHtcbiAgcmVmcmVzaFNpZGVOYXZVSSh3YXJkKTtcbiAgc2hvd1dhcmRBZG1pc3Npb25TdGF0dXNMb2FkaW5nVUkoKTtcbiAgY29uc3QgV05hbWUgPSB3YXJkLmlubmVySFRNTDtcbiAgY29uc3QgSFdJRCA9IGZpbmRIV0lEKFdOYW1lKTtcbiAgY29uc3QgYXBpVVJMID0gYEFkbWlzc2lvblN0YXR1cy8ke0hXSUR9YDtcbiAgZ2V0QWRtaXNzaW9uU3RhdHVzQnlXYXJkKGFwaVVSTCwgV05hbWUpO1xufVxuXG5mdW5jdGlvbiByZWZyZXNoU2lkZU5hdlVJKGl0ZW0pIHtcbiAgJCgnLnNpZGUtbmF2LS1ib2R5IC5zaWRlLW5hdi0taXRlbScpLnJlbW92ZUNsYXNzKCdzaWRlLW5hdi0taXRlbV9fY2xpY2tlZCcpO1xuICAkKGl0ZW0pLmFkZENsYXNzKCdzaWRlLW5hdi0taXRlbV9fY2xpY2tlZCcpO1xufVxuXG5mdW5jdGlvbiBzaG93V2FyZEFkbWlzc2lvblN0YXR1c0xvYWRpbmdVSSgpIHtcbiAgJCgnLmNvbnRlbnQtLWhlYWRlcicpLmh0bWwoJzxpbWcgY2xhc3M9XCJzcGlubmVyXCIgc3JjPVwiaW1hZ2VzL3NwaW5uZXIuZ2lmXCIgYWx0PVwibG9hZGluZ1wiPicpO1xuICAkKCcuY29udGVudC0tYm9keScpLmh0bWwoJzxkaXYgY2xhc3M9XCJzcGlubmVyLXdyYXBcIj48aW1nIGNsYXNzPVwic3Bpbm5lclwiIHNyYz1cImltYWdlcy9zcGlubmVyLmdpZlwiIGFsdD1cImxvYWRpbmdcIj48L2Rpdj4nKTtcbn1cblxuZnVuY3Rpb24gZmluZEhXSUQoV05hbWUpIHtcbiAgbGV0IEhXSUQgPSAnJztcbiAgZm9yIChjb25zdCBkZXBCZWQgb2YgaG9zRGVwQmVkKSB7XG4gICAgaWYgKFdOYW1lID09PSBkZXBCZWQuV05hbWUpIHtcbiAgICAgIEhXSUQgPSBkZXBCZWQuSFdJRDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIEhXSUQ7XG59XG5cbmZ1bmN0aW9uIGdldEFkbWlzc2lvblN0YXR1c0J5V2FyZChhcGlVUkwsIFdOYW1lKSB7XG4gIGNvbnN0IGFsbEFkbWlzc2lvblN0YXR1cyA9IFByb21pc2UucmVzb2x2ZShnZXREYXRhKGFwaVVSTCkpO1xuICBhbGxBZG1pc3Npb25TdGF0dXMudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICBzaG93QWRtaXNzaW9uU3RhdHVzKHJlc3BvbnNlLCBXTmFtZSk7XG4gIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIHNob3dBZG1pc3Npb25TdGF0dXMobnVsbCwgV05hbWUpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dBZG1pc3Npb25TdGF0dXMoYWxsQWRtaXNzaW9uU3RhdHVzLCBXTmFtZSkge1xuICAkKCcuY29udGVudC0tYm9keSAqJykucmVtb3ZlKCk7XG4gICQoJy5jb250ZW50LS1oZWFkZXInKS50ZXh0KFdOYW1lKTtcbiAgaWYgKCFhbGxBZG1pc3Npb25TdGF0dXMpIHtcbiAgICAkKCcuY29udGVudC0tYm9keScpLmFwcGVuZCgnPGkgY2xhc3M9XCJuby1kYXRhXCI+LS0tIOWwmueEoeizh+aWmSAtLS08L2k+Jyk7XG4gIH0gZWxzZSB7XG4gICAgc2hvd0FkbWlzc2lvblN0YXR1c1RhYmxlSGVhZCgpO1xuICAgIHNob3dBZG1pc3Npb25TdGF0dXNUYWJsZURhdGEoYWxsQWRtaXNzaW9uU3RhdHVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzaG93QWRtaXNzaW9uU3RhdHVzVGFibGVIZWFkKCkge1xuICAkKCcuY29udGVudC0tYm9keScpLmFwcGVuZCgnPHRhYmxlIGNsYXNzPVwiYWRtaXNzaW9uLXN0YXR1c1wiPjwvdGFibGU+Jyk7XG4gICQoJy5hZG1pc3Npb24tc3RhdHVzJykuYXBwZW5kKFxuICAgIGA8dHIgY2xhc3M9XCJhZG1pc3Npb24tc3RhdHVzLS1oZWFkXCI+XG4gICAgICAgIDx0aD7np5HliKU8L3RoPlxuICAgICAgICA8dGg+55eF5bqK6Jmf56K8PC90aD5cbiAgICAgICAgPHRoPueXheaCo+izh+aWmTwvdGg+XG4gICAgICAgIDx0aD7kvY/pmaLml6XmnJ88L3RoPlxuICAgICAgICA8L3RyPmAsXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNob3dBZG1pc3Npb25TdGF0dXNUYWJsZURhdGEoYWxsQWRtaXNzaW9uU3RhdHVzKSB7XG4gIGlmIChhbGxBZG1pc3Npb25TdGF0dXMubGVuZ3RoID4gMCkge1xuICAgIGZvciAoY29uc3QgYWRtaXNzaW9uU3RhdHVzIG9mIGFsbEFkbWlzc2lvblN0YXR1cykge1xuICAgICAgJCgnLmFkbWlzc2lvbi1zdGF0dXMnKS5hcHBlbmQoXG4gICAgICAgIGA8dHIgY2xhc3M9YWRtaXNzaW9uLXN0YXR1cy0tZGF0YSBkYXRhLWFpZD0ke2FkbWlzc2lvblN0YXR1cy5BSUR9IG9uQ2xpY2s9XCJsb2FkUGF0aWVudERhdGEodGhpcylcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7YWRtaXNzaW9uU3RhdHVzLkRlcE5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7YWRtaXNzaW9uU3RhdHVzLldhcmROb308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBhdGllbnQtbmFtZVwiPiR7YWRtaXNzaW9uU3RhdHVzLkNOTX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ZD4ke2FkbWlzc2lvblN0YXR1cy5Jbkhvc0RhdGV9PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPmAsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAkKCcuY29udGVudC0tYm9keScpLmFwcGVuZCgnPGkgY2xhc3M9XCJuby1kYXRhXCI+LS0tIOWwmueEoeizh+aWmSAtLS08L2k+Jyk7XG4gIH1cbn1cblxuLy8gUGF0aWVudEluZm9cbmxldCBwYXRpZW50QUlEID0gJyc7XG5cbmZ1bmN0aW9uIGxvYWRQYXRpZW50RGF0YShwYXRpZW50KSB7XG4gIHJlZnJlc2hBZG1pc3Npb25TdGF0dXNVSShwYXRpZW50KTtcbiAgc2hvd1BhdGllbnRzQWRtaXNzdGlvbkxvYWRpbmdVSSgpO1xuICBjb25zdCBBSUQgPSAkKHBhdGllbnQpLmRhdGEoJ2FpZCcpO1xuICBwYXRpZW50QUlEID0gQUlEO1xuICBjb25zdCBwYXRpZW50SW5mb1VSTCA9IGBQYXRpZW50SW5mb1I/aWQ9JHtBSUR9YDtcbiAgY29uc3QgYWRtaXNzaW9uU3RhdHVzVVJMID0gJ0FkbWlzc2lvblN0YXR1cyc7XG4gIGdldFBhdGllbnRBZG1pc3Npb25EYXRhKHBhdGllbnRJbmZvVVJMLCBhZG1pc3Npb25TdGF0dXNVUkwsIEFJRCk7XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hBZG1pc3Npb25TdGF0dXNVSShsaXN0SXRlbSkge1xuICAkKCcuYWRtaXNzaW9uLXN0YXR1cy0tZGF0YScpLnJlbW92ZUNsYXNzKCdhZG1pc3Npb24tc3RhdHVzLS1kYXRhX19jbGlja2VkJyk7XG4gICQobGlzdEl0ZW0pLmFkZENsYXNzKCdhZG1pc3Npb24tc3RhdHVzLS1kYXRhX19jbGlja2VkJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dQYXRpZW50c0FkbWlzc3Rpb25Mb2FkaW5nVUkoKSB7XG4gICQoJy5wYXRpZW50LWluZm8nKS5odG1sKFxuICAgIGA8ZGl2IGNsYXNzPVwic3Bpbm5lci13cmFwXCI+XG4gICAgICAgIDxpbWcgIGNsYXNzPVwic3Bpbm5lclwiIHNyYz1cImltYWdlcy9zcGlubmVyLmdpZlwiIGFsdD1cImxvYWRpbmdcIj5cbiAgICAgICAgPC9kaXY+YCxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aWVudEFkbWlzc2lvbkRhdGEocGF0aWVudEluZm9VUkwsIGFkbWlzc2lvblN0YXR1c1VSTCwgQUlEKSB7XG4gIGxldCBwYXRpZW50SW5mbyA9IHt9O1xuICBsZXQgYWRtaXNzaW9uU3RhdHVzID0ge307XG4gIFByb21pc2UuYWxsKFtnZXREYXRhKHBhdGllbnRJbmZvVVJMKSwgZ2V0RGF0YShhZG1pc3Npb25TdGF0dXNVUkwpXSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICBwYXRpZW50SW5mbyA9IHJlc3BvbnNlWzBdO1xuICAgIGNvbnN0IGFsbEFkbWlzc2lvblN0YXR1cyA9IHJlc3BvbnNlWzFdO1xuICAgIGFkbWlzc2lvblN0YXR1cyA9IGZpbmRBZG1pc3Npb25TdGF0dXMoYWxsQWRtaXNzaW9uU3RhdHVzLCBBSUQpO1xuICAgIGNvbnN0IG5pc1RvcFJlY29yZFVSTCA9IGBOSVNUUFI/aWQ9JHtBSUR9JnN0YXJ0RGF0ZT0ke2FkbWlzc2lvblN0YXR1cy5Jbkhvc0RhdGV9YDtcbiAgICByZXR1cm4gZ2V0RGF0YShuaXNUb3BSZWNvcmRVUkwpO1xuICB9KS50aGVuKChuaXNUb3BSZWNvcmRzKSA9PiB7XG4gICAgY29uc3QgcGF0aWVudHNBZG1pc3Npb25EYXRhID0gZ2VuZXJhdGVQYXRpZW50c0FkbWlzc2lvbkRhdGEocGF0aWVudEluZm8sIGFkbWlzc2lvblN0YXR1cywgbmlzVG9wUmVjb3Jkcyk7XG4gICAgc2hvd1BhdGllbnRzQWRtaXNzaW9uRGF0YShwYXRpZW50c0FkbWlzc2lvbkRhdGEsIEFJRCk7XG4gIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICQoJy5wYXRpZW50LWluZm8nKS5odG1sKCc8aSBjbGFzcz1cIm5vLWRhdGEgbm8tZGF0YS0tYWRtaXNzaW9uXCI+LS0tIOWwmueEoeS9j+mZouizh+aWmSAtLS08L2k+Jyk7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmluZEFkbWlzc2lvblN0YXR1cyhhbGxBZG1pc3Npb25TdGF0dXMsIEFJRCkge1xuICBmb3IgKGNvbnN0IGFkbWlzc3Rpb25TdGF0dXMgb2YgYWxsQWRtaXNzaW9uU3RhdHVzKSB7XG4gICAgaWYgKGFkbWlzc3Rpb25TdGF0dXMuQUlEID09IEFJRCkge1xuICAgICAgcmV0dXJuIGFkbWlzc3Rpb25TdGF0dXM7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVBhdGllbnRzQWRtaXNzaW9uRGF0YShwYXRpZW50SW5mbywgYWRtaXNzaW9uU3RhdHVzLCBuaXNUb3BSZWNvcmRzKSB7XG4gIGNvbnN0IHBhdGllbnRzQWRtaXNzaW9uRGF0YSA9IHt9O1xuXG4gIHBhdGllbnRzQWRtaXNzaW9uRGF0YS5DTk0gPSBwYXRpZW50SW5mby5DTk07XG4gIHBhdGllbnRzQWRtaXNzaW9uRGF0YS5HRU5ERVIgPSAocGF0aWVudEluZm8uR2VuZGVyID09IDApID8gJ+eUtycgOiAn5aWzJzsgLy8gbWFnaWMgbnVtYmVyIHByb2JsZW0/P1xuICBwYXRpZW50c0FkbWlzc2lvbkRhdGEuYWdlID0gcGF0aWVudEluZm8uYWdlO1xuICBwYXRpZW50c0FkbWlzc2lvbkRhdGEuSUROTyA9IHBhdGllbnRJbmZvLklETk87XG5cbiAgcGF0aWVudHNBZG1pc3Npb25EYXRhLm5pc1RvcFJlY29yZHMgPSAnJztcbiAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChuaXNUb3BSZWNvcmRzKSkge1xuICAgIGZvciAoY29uc3QgbmlzVG9wUmVjb3JkIG9mIG5pc1RvcFJlY29yZHMpIHtcbiAgICAgIHBhdGllbnRzQWRtaXNzaW9uRGF0YS5uaXNUb3BSZWNvcmRzXG4gICAgICAgICAgICAgICAgKz0gYDxsaT5cbiAgICAgICAgICAgIDxzcGFuPiR7bmlzVG9wUmVjb3JkLkl0ZW19PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+JHtuaXNUb3BSZWNvcmQuVmFsdWV9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+JHtuaXNUb3BSZWNvcmQuRGF0ZVRpbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9saT5gO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXRpZW50c0FkbWlzc2lvbkRhdGEubmlzVG9wUmVjb3JkcyA9ICc8bGk+PGk+LS0t5bCa54Sh6LOH5paZLS0tPC9pPjwvbGk+JztcbiAgfVxuXG4gIHBhdGllbnRzQWRtaXNzaW9uRGF0YS5Qcm9ibGVtTm90ZXMgPSBpbnRlcnByZXRKc29uU3RyaW5nKGFkbWlzc2lvblN0YXR1cy5Qcm9ibGVtTm90ZXMpO1xuICBwYXRpZW50c0FkbWlzc2lvbkRhdGEuQ2F0YXN0cm9waGljSWxsbmVzcyA9IGludGVycHJldEpzb25TdHJpbmcoYWRtaXNzaW9uU3RhdHVzLkNhdGFzdHJvcGhpY0lsbG5lc3MpO1xuICBwYXRpZW50c0FkbWlzc2lvbkRhdGEuQWxsZXJneSA9IGludGVycHJldEpzb25TdHJpbmcoYWRtaXNzaW9uU3RhdHVzLkFsbGVyZ3kpO1xuICBwYXRpZW50c0FkbWlzc2lvbkRhdGEuU3BlY2lhbE5vdGVzID0gaW50ZXJwcmV0SnNvblN0cmluZyhhZG1pc3Npb25TdGF0dXMuU3BlY2lhbE5vdGVzKTtcbiAgcGF0aWVudHNBZG1pc3Npb25EYXRhLk5vdGVzID0gaW50ZXJwcmV0SnNvblN0cmluZyhhZG1pc3Npb25TdGF0dXMuTm90ZXMpO1xuXG4gIHJldHVybiBwYXRpZW50c0FkbWlzc2lvbkRhdGE7XG59XG5cbmZ1bmN0aW9uIHNob3dQYXRpZW50c0FkbWlzc2lvbkRhdGEocGF0aWVudHNBZG1pc3Npb25EYXRhLCBBSUQpIHtcbiAgJCgnLnBhdGllbnQtaW5mbycpLmh0bWwoJzxkaXYgY2xhc3M9XCJwYXRpZW50LWluZm9cIj4gPGRpdiBjbGFzcz1cInBhdGllbnQtaW5mby0taGVhZFwiPiA8ZGl2PiA8aDIgaWQ9XCJwYXRpZW50LW5hbWVcIj5OYW1lPC9oMj4gPHAgaWQ9XCJwYXRpZW50LWdlbmRlci1hbmQtYWdlXCI+R2VuZGVyLCBBZ2U8L3A+IDwvZGl2PiA8cCBpZD1cInBhdGllbnQtSURcIj5JRCBudW1iZXI8L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGF0aWVudC1pbmZvLS1ib2R5XCI+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC1hcmVhXCI+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC0tYnRuXCIgZGF0YS10ZW1wLWNvZGU9XCJBZDAwMVwiPuafpeaIv+mmlumggTwvZGl2PiA8ZGl2IGNsYXNzPVwicGF0aWVudC1yZXBvcnQtLWJ0blwiIGRhdGEtdGVtcC1jb2RlPVwiQWQwMDJcIj7kvY/pmaLnl4XmgqPos4foqIo8L2Rpdj4gPGRpdiBjbGFzcz1cInBhdGllbnQtcmVwb3J0LS1idG5cIiBkYXRhLXRlbXAtY29kZT1cIkFkMDAzXCI+5L2P6Zmi6Ki65pa3PC9kaXY+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC0tYnRuXCIgZGF0YS10ZW1wLWNvZGU9XCJBZDAwNFwiPuaqoumpl+WgseWRijwvZGl2PiA8ZGl2IGNsYXNzPVwicGF0aWVudC1yZXBvcnQtLWJ0blwiIGRhdGEtdGVtcC1jb2RlPVwiQWQwMDVcIj5EREPloLHlkYo8L2Rpdj4gPGRpdiBjbGFzcz1cInBhdGllbnQtcmVwb3J0LS1idG5cIiBkYXRhLXRlbXAtY29kZT1cIkFkMDA2XCI+55eF55CG5aCx5ZGKPC9kaXY+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC0tYnRuXCIgZGF0YS10ZW1wLWNvZGU9XCJBZDAwN1wiXCI+5qqi5p+l5aCx5ZGKPC9kaXY+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC0tYnRuXCIgZGF0YS10ZW1wLWNvZGU9XCJBZDAwOFwiPueUn+eQhuWgseWRijwvZGl2PiA8ZGl2IGNsYXNzPVwicGF0aWVudC1yZXBvcnQtLWJ0blwiIGRhdGEtdGVtcC1jb2RlPVwiQWQwMDlcIj7kvY/pmaLphqvlm5HplbfmnJ/phqvku6Q8L2Rpdj4gPGRpdiBjbGFzcz1cInBhdGllbnQtcmVwb3J0LS1idG5cIiBkYXRhLXRlbXAtY29kZT1cIkFkMDEwXCI+5L2P6Zmi6Yar5ZuR5Y2z5pmC6Yar5LukPC9kaXY+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC0tYnRuXCIgZGF0YS10ZW1wLWNvZGU9XCJBZDAxMVwiPueXheatt+aRmOimgeWFpemZoueXheaRmDwvZGl2PiA8ZGl2IGNsYXNzPVwicGF0aWVudC1yZXBvcnQtLWJ0blwiIGRhdGEtdGVtcC1jb2RlPVwiQWQwMTJcIj7nl4XmrbfmkZjopoHkvY/pmaLnl4XmkZg8L2Rpdj4gPGRpdiBjbGFzcz1cInBhdGllbnQtcmVwb3J0LS1idG5cIiBkYXRhLXRlbXAtY29kZT1cIkFkMDEzXCI+55eF5q235pGY6KaB5Ye66Zmi55eF5pGYPC9kaXY+IDxkaXYgY2xhc3M9XCJwYXRpZW50LXJlcG9ydC0tYnRuXCIgZGF0YS10ZW1wLWNvZGU9XCJBZDAxNFwiPuaUvuWwhOenkeWgseWRijwvZGl2PiA8ZGl2IGNsYXNzPVwicGF0aWVudC1yZXBvcnQtLWJ0blwiIGRhdGEtdGVtcC1jb2RlPVwiQWQwMTVcIj7mnIPoqLrntIDpjIQ8L2Rpdj4gPGRpdiBjbGFzcz1cInBhdGllbnQtcmVwb3J0LS1idG5cIiBkYXRhLXRlbXAtY29kZT1cIkFkMDE2XCI+5q235Y+y5bCx6Yar57SA6YyEPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibmlzdHByLWFyZWFcIj4gPHAgY2xhc3M9XCJwcm9ibGVtLXRpdGxlXCI+55Sf5ZG95b616LGhPC9wPiA8dWwgY2xhc3M9XCJuaXN0cHItbGlzdFwiPiA8bGk+PGk+LS0t5bCa54Sh6LOH5paZLS0tPC9pPjwvbGk+IDwvdWw+IDwvZGl2PiA8dWwgY2xhc3M9XCJwYXRpZW50LW5vdGVzXCI+IDxsaT4gPHAgY2xhc3M9XCJwcm9ibGVtLXRpdGxlXCI+5ZWP6aGM6Ki76KiYPC9wPiA8dWwgY2xhc3M9XCJwcm9ibGVtLW5vdGVzXCIgaWQ9XCJwcm9ibGVtLW5vdGVcIj4gPGxpIGNsYXNzPVwicHJvYmxlbS1ub3RlXCI+IDxkaXYgY2xhc3M9XCJwcm9ibGVtLW5vdGUtZGV0YWlsLWdyb3VwXCI+IDxpPi0tLeWwmueEoeizh+aWmS0tLTwvaT4gPC9kaXY+IDwvbGk+IDwvdWw+IDwvbGk+IDxsaT4gPHAgY2xhc3M9XCJwcm9ibGVtLXRpdGxlXCI+6YeN5aSn55a+55eFPC9wPiA8dWwgY2xhc3M9XCJwcm9ibGVtLW5vdGVzXCIgaWQ9XCJjYXRhc3Ryb3BoaWMtaWxsbmVzcy1ub3RlXCI+IDxsaSBjbGFzcz1cInByb2JsZW0tbm90ZVwiPiA8ZGl2IGNsYXNzPVwicHJvYmxlbS1ub3RlLWRldGFpbC1ncm91cFwiPiA8aT4tLS3lsJrnhKHos4fmlpktLS08L2k+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2xpPiA8bGk+IDxwIGNsYXNzPVwicHJvYmxlbS10aXRsZVwiPumBjuaVj+e0gOmMhDwvcD4gPHVsIGNsYXNzPVwicHJvYmxlbS1ub3Rlc1wiIGlkPVwiYWxsZXJneS1ub3RlXCI+IDxsaSBjbGFzcz1cInByb2JsZW0tbm90ZVwiPiA8ZGl2IGNsYXNzPVwicHJvYmxlbS1ub3RlLWRldGFpbC1ncm91cFwiPiA8aT4tLS3lsJrnhKHos4fmlpktLS08L2k+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2xpPiA8bGk+IDxwIGNsYXNzPVwicHJvYmxlbS10aXRsZVwiPueJueauiuiou+iomDwvcD4gPHVsIGNsYXNzPVwicHJvYmxlbS1ub3Rlc1wiIGlkPVwic3BlY2lhbC1ub3RlXCI+IDxsaSBjbGFzcz1cInByb2JsZW0tbm90ZVwiPiA8ZGl2IGNsYXNzPVwicHJvYmxlbS1ub3RlLWRldGFpbC1ncm91cFwiPiA8aT4tLS3lsJrnhKHos4fmlpktLS08L2k+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2xpPiA8bGk+IDxwIGNsYXNzPVwicHJvYmxlbS10aXRsZVwiPuiou+iomDwvcD4gPHVsIGNsYXNzPVwicHJvYmxlbS1ub3Rlc1wiIGlkPVwib3RoZXItbm90ZXNcIj4gPGxpIGNsYXNzPVwicHJvYmxlbS1ub3RlXCI+IDxkaXYgY2xhc3M9XCJwcm9ibGVtLW5vdGUtZGV0YWlsLWdyb3VwXCI+IDxpPi0tLeWwmueEoeizh+aWmS0tLTwvaT4gPC9kaXY+IDwvbGk+IDwvdWw+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4nKTtcblxuICBnZW5lcmF0ZVJlcG9ydEJ1dHRvbihBSUQpO1xuXG4gICQoJyNwYXRpZW50LW5hbWUnKS50ZXh0KHBhdGllbnRzQWRtaXNzaW9uRGF0YS5DTk0pO1xuICAkKCcjcGF0aWVudC1nZW5kZXItYW5kLWFnZScpLnRleHQoYCR7cGF0aWVudHNBZG1pc3Npb25EYXRhLkdFTkRFUn0sICR7cGF0aWVudHNBZG1pc3Npb25EYXRhLmFnZX3mrbJgKTtcbiAgJCgnI3BhdGllbnQtSUQnKS50ZXh0KHBhdGllbnRzQWRtaXNzaW9uRGF0YS5JRE5PKTtcblxuICAkKCcubmlzdHByLWxpc3QnKS5odG1sKHBhdGllbnRzQWRtaXNzaW9uRGF0YS5uaXNUb3BSZWNvcmRzKTtcbiAgJCgnI3Byb2JsZW0tbm90ZScpLmh0bWwocGF0aWVudHNBZG1pc3Npb25EYXRhLlByb2JsZW1Ob3Rlcyk7XG4gICQoJyNjYXRhc3Ryb3BoaWMtaWxsbmVzcy1ub3RlJykuaHRtbChwYXRpZW50c0FkbWlzc2lvbkRhdGEuQ2F0YXN0cm9waGljSWxsbmVzcyk7XG4gICQoJyNhbGxlcmd5LW5vdGUnKS5odG1sKHBhdGllbnRzQWRtaXNzaW9uRGF0YS5BbGxlcmd5KTtcbiAgJCgnI3NwZWNpYWwtbm90ZScpLmh0bWwocGF0aWVudHNBZG1pc3Npb25EYXRhLlNwZWNpYWxOb3Rlcyk7XG4gICQoJyNvdGhlci1ub3RlcycpLmh0bWwocGF0aWVudHNBZG1pc3Npb25EYXRhLk5vdGVzKTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwcmV0SnNvblN0cmluZyhqc29uU3RyaW5nKSB7XG4gIGNvbnN0IE5PREFUQU1FU1NBR0UgPSAnPGxpIGNsYXNzPVwicHJvYmxlbS1ub3RlXCI+PGRpdiBjbGFzcz1cInByb2JsZW0tbm90ZS1kZXRhaWwtZ3JvdXBcIj48aT4tLS3lsJrnhKHos4fmlpktLS08L2k+PC9kaXY+PC9saT4nO1xuICBpZiAoIWpzb25TdHJpbmcpIHsgLy8ganNvblN0cmluZyBpcyBcIlwiLlxuICAgIHJldHVybiBOT0RBVEFNRVNTQUdFO1xuICB9XG4gIGNvbnN0IGpzb25PYmplY3QgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGZvciAoY29uc3Qgc3ViT2JqZWN0IG9mIGpzb25PYmplY3QpIHtcbiAgICBjb25zdCBzdWJPYmplY3RLZXlzID0gT2JqZWN0LmtleXMoc3ViT2JqZWN0KTtcbiAgICByZXN1bHQgKz0gJzxsaSBjbGFzcz1cInByb2JsZW0tbm90ZVwiPjxkaXYgY2xhc3M9XCJwcm9ibGVtLW5vdGUtZGV0YWlsLWdyb3VwXCI+JztcbiAgICBmb3IgKGNvbnN0IHN1Yk9iamVjdEtleSBvZiBzdWJPYmplY3RLZXlzKSB7XG4gICAgICByZXN1bHQgKz0gYDxkaXY+PHNwYW4+JHtzdWJPYmplY3RLZXl9OiA8L3NwYW4+YFxuICAgICAgICAgICAgICAgICAgICArIGA8c3Bhbj4ke3N1Yk9iamVjdFtzdWJPYmplY3RLZXldfSA8L3NwYW4+PC9kaXY+YDtcbiAgICB9XG4gICAgcmVzdWx0ICs9ICc8L2Rpdj48L2xpPic7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSZXBvcnRCdXR0b24oQUlEKSB7XG4gIC8vIGRpcnR5IGNvZGVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgY29uc3QgdHdvRGlnaXROdW1iZXIgPSAoYDAke2kgKyAxfWApLnNsaWNlKC0yKTtcbiAgICBjb25zdCB0ZW1wQ29kZSA9IGBBZDAke3R3b0RpZ2l0TnVtYmVyfWA7XG4gICAgY29uc3QgRG9jdW1lbnRJbmRleGVzQVBJVVJMID0gYERvY3VtZW50SW5kZXhlc1IvJHtBSUR9P3A9JHt0ZW1wQ29kZX1gO1xuICAgIGdldERhdGEoRG9jdW1lbnRJbmRleGVzQVBJVVJMKS50aGVuKCgpID0+IHtcbiAgICAgICQoYC5wYXRpZW50LXJlcG9ydC0tYnRuOm50aC1jaGlsZCgkeyhpICsgMSl9KWApLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgdGVtcENvZGUgfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHNob3dSZXBvcnQodGVtcENvZGUsIEFJRCk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAkKGAucGF0aWVudC1yZXBvcnQtLWJ0bjpudGgtY2hpbGQoJHsoaSArIDEpfSlgKS5hZGRDbGFzcygncGF0aWVudC1yZXBvcnQtLWJ0bl9fZGlzYWJsZScpO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIHJlcG9ydFxuZnVuY3Rpb24gc2hvd1JlcG9ydCh0ZW1wQ29kZSwgQUlEKSB7XG4gIHdpbmRvdy5vcGVuKGByZXBvcnQuaHRtbD9BSUQ9JHtBSUR9JnRlbXBDb2RlPSR7dGVtcENvZGV9YCk7XG59XG5cbiJdfQ==