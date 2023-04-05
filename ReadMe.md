## ✨ 프로젝트 소개
* ECS를 이용한 CI/CD 환경 구축

  * ECS를 사용해 컨테이너화된 애플리케이션을 쉽게 배포하고 관리할 수 있습니다.
  * CI/CD 환경을 통해 자동화된 배포 프로세스 구축합니다.

## 🌐 서비스 아키텍쳐
AWS ECS 서비스의 CI/CD
![image](https://user-images.githubusercontent.com/118710033/229147118-46f7664a-04d7-4c46-819f-2a2badadbfdd.png)

Codepipeline을 이용한 프론트엔드 CI/CD
![image](https://user-images.githubusercontent.com/118710033/229151945-faeab13f-0324-47df-a1a3-09a980dcc871.png)



## 📌 서비스 구성  
<details>
<summary>Docker 이미지 빌드 및 ECR에 PUSH 자동화 구현</summary>

* fastify 프레임 워크를 이용한 WAS 서버를 생성합니다.
* WAS 및 MongoDB를 Dockerfile 생성합니다.
* Github Action을 사용하기 위한 AWS ECR 이미지 빌드 Workflow yaml 파일을 생성합니다.
  * push를 통해 ECR에 새로운 태그로 도커 이미지가 준비
  * AWS 키페어를 생성 후 Github 레포지토리 Setting 클립 Secrets and variables 항목에 저장
  * Configure AWS credentials의 키 페어 값을 환경변수로 설정
  
* Private ECR 레포지토리 생성
  * Docker 클라이언트 인증을 위해 AWS CLI를 사용하여 터미널에 인증 토큰 인증합니다.
  * 태그를 지정 하여 리포지토리에 PUSH합니다.
</details>

<details>
<summary>ECS 클러스터 생성 및 서비스 배포 자동화 구현</summary>

* ECR에 저장된 서버 이미지를 ECS로 배포
  * Task Definition 설정합니다.
    * ECR에 올린 이미지에 URL을 컨테이너에 등록
    * 사용할 포트 설정
  * MongoDB 이미지 배포 시 AWS Secrets Manager를 이용한 키 값 페어 설정합니다.
    ECS에서 AWS Secrets Manager를 사용하기 위해 정책을 추가함.
* ECS 클러스터 생성 및 WAS와 MongoDB 서비스 생성합니다.
  * 클러스터 생성 시 보안그룹, 서브넷, 로드밸런서, 리스너, 타겟 그룹 설정
* 배포 자동화 스크립트를 이용해 이미지 업데이트 및 배포 자동화 구현합니다.
  * Json 형식의 Task Definition을 Git repository에 추가함
  * 기존의 ECR yaml 파일은 중복되므로 삭제함.
  * 작업 정의 파일에 민감 정보가 포함되어 있는지 여부를 확인함.
  
  
</details>

<details>
<summary>프론트엔드 배포 자동화 구현 ------- </summary>

* CodePipeline을 이용한 클라이언트 파이프라인 구축합니다.
  * 파이프라인을 구축하며 GitHub 리포지토리, 배포 공급자, 빌드 공급자 설정함.
  * 좀 더 기정리하기
</details>

<details>
<summary>HTTPS 설정</summary>

* Route53, Cloudfront, ELB, 리스너, 타겟 그룹 등을 설정하여 HTTPS 환경 설정합니다.
</details>


## 💪 무엇을 배웠는가?
* fastiy 프레임워크를 이용한 컨테이너 배포 방법을 알게됐습니다.
  * fastify 서버를 시작하면 로컬호스트 주소로 동작하므로 AWS에 컨테이너를 띄워도 접속할 수 없음. 
  * 따라서, package.json에서 -a 옵션으로 0.0.0.0 주소로 시작할 수 있도록 해야함.
* GitHub Action을 이용한 ECS 자동화 동작 원리를 알고 workflow 파일을 작성할 수 있었습니다.   ------
  * Task Definition에 Json파일을 이용한 CI/CD를 알 수 있었습니다.
  * ECR, ECS Workflow파일에 대해 공부할 수 있었음.
* AWS Secrets Manager를 이용한 데이터베이스 Task Definition에 환경변수를 설정할 수 있었습니다.
  * AWS Secrets Manager를 사용하기 위해서는 ECS역할에 Secrets Manager ReadWrite정책을 추가해줘야 사용할 수 있음.
* Codepipeline을 공부하며 프로튼엔드 서버에 사용할 수 있었습니다.   ---------
  * codedeploy에 appspec파일, buildspoc파일에 대해 공부 할 수 있었습니다.    --------
* 무중단 배포를 이용해 보면서 CI/CD에 편리함과 필요성을 느꼈습니다.
  * 변경 사항이 빠르게 반영되고 인적 오류를 줄여 안정성과 가용성이 확보한 상태로 배포할 수 있다는것을 느꼈음.


## 🚨 트러블 슈팅
### 문제 상황

ECS 배포시 GitHub Action에서는 정상적으로 배포되었다는 알림이 생기지만 실행 시간이 26분이었습니다. 

배포 된 이미지는 새로운 이미지가 아닌 기존에 이미지가 배포된 상태였습니다.


### 원인 파악

* 문제가 될 수 있는 부분을 도출했습니다.
  - 깃허브 액션
  - 클러스터 서비스 설정
  - task definition
* 먼저 배포가 정상적으로 됐기 때문에 GitHub Action Workflow에서는 문제가 없다 판단했습니다.
* 클러스터 서비스와 Task Definition를 재설정하지만 똑같은 오류가 발생하고 있었습니다.
* 처음부터 트래픽 흐름을 순차적으로 생각하며 문제를 찾았습니다.
* ECS에서 ECR로 새로운 이미지를 찾을 수 없어 문제가 되고 있다는 것을 확인했습니다. 
  * 즉 workflow 파일에 설정에 문제가 있다는 것을 확인했습니다.
  * 배포가 정삭적으로 됐다고 그 부분을 배재하고 다른 문제를 찾은게 트러블 슈팅에 중요한 문제였음.
  * 단면적인 실행 상태를 보고 판단하는게 아닌 순차적으로 흐름에 따라 문제를 찾고 해결해야 되는것을 알게됨.

### 문제 해결
Workflow파일에 ECR_Registry가 정답이지만 제 파일에는 Registry만 적혀져 있었습니다.
Workflow 내용을 공부하면서 직접 작성했던것이 에러를 만들었던 원인이었고 ECR_Registry로 수정 후 3분 이내로 새로운 이미지가 배포되었습니다.


## 📋 블로깅 & 레퍼런스
* 블로깅
  * https://jihoon555.tistory.com/58
  * https://jihoon555.tistory.com/59
 
* 레퍼런스 
  * https://www.fastify.io/
  * https://github.com/fastify/fastify-cli
  * https://github.com/aws-actions/amazon-ecr-login
  * https://hub.docker.com/_/mongo
