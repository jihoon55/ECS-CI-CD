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
어떻게 만드었는지 이미지랑 같이 설명하고 이걸 왜 사용했는지도 명

<details>
<summary>Docker 이미지 빌드 및 ECR에 PUSH 자동화 구현</summary>

* fastify 프레임 워크를 이용한 WAS 서버 생성 
* WAS 및 MongoDB를 Dockerfile 생성
* Github Action을 사용하기 위한 AWS ECR 이미지 빌드 yaml 파일 생성
  * AWS 키페어를 생성 후 Github 레포지토리 Setting 클립 Secrets and variables 항목에 저장
  * Configure AWS credentials의 키 페어를 값을 환경변수로 설정
* Private ECR 레포지토리 생성
  * Docker 클라이언트 인증을 위해 AWS CLI를 사용하여 터미널에 인증 토큰 인증
  * 태그를 지정 하여 리포지토리에 PUSH
</details>

<details>
<summary>ECS 클러스터 생성 및 서비스 배포 자동화 구현</summary>

* ECR에 저장된 서버 이미지를 ECS로 배포
  * Task Definition 설정
    * ECR에 올린 이미지에 URL을 컨테이너에 등록
    * 사용할 포트 설정
  * MongoDB 이미지 배포 시 AWS Secrets Manager를 이용한 키 값 페어 설정함.
    ECS에서 AWS Secrets Manager를 사용하기 위해 정책을 추가함.
* ECS 클러스터 생성 및 WAS와 MongoDB 서비스 생성
  * 클러스터 생성 시 보안그룹, 서브넷, 로드밸런서, 리스너, 타겟 그룹 설정
* 배포 자동화 스크립트를 이용해 이미지 업데이트 및 배포 자동화 구현
  * Json 형식의 Task Definition을 Git repository에 추가한다
  * 기존의 ECR yaml 파일은 중복되므로 삭제한다.
  * 작업 정의 파일에 민감 정보가 포함되어 있는지 여부를 확인한다
  * Github Action 실행 확인
  
  
</details>

<details>
<summary>프론트엔드 배포 자동화 구현</summary>

* CodePipeline을 이용한 클라이언트 파이프라인 구축
  * GitHub 리포지토리, 배포 공급자, 빌드 공급자 설정
</details>

<details>
<summary>HTTPS 설정</summary>

* Route53, Cloudfront, ELB, 리스너, 타겟 그룹 등을 설정하여 HTTPS 환경 설정
</details>


## 💪 무엇을 배웠는가?
* fastiy 프레임워크를 이용한 컨테이너 배포 방법을 알게됐습니다.
  * fastify 서버를 시작하면 로컬호스트 주소로 동작하므로 AWS에 컨테이너를 띄워도 접속할 수 없다. 따라서, package.json에서 -a 옵션으로 0.0.0.0 주소로 시작할 수 있도록 해야한다.
* GitHub Action을 이용한 ECS 자동화 동작 원리를 알고, Json파일을 이용한 CI/CD를 알 수 있었습니다.


서브넷망에 따른 ELB의 설정과 리스너, 규칙, 타겟 그룹 설정을 알게 되었습니다.

내부통신을 위한 인터널과 외부통신을 위한 익스터널에 대해 알게 되었음.
S3와 Cloudfront를 같이 사용하며 oac, acm, 버킷정책을 통한 보안 방법에 대해 공부할 수 있었습니다.

S3가 퍼블릭한 환경에 있을 경우 보안상 안전하지 않고 이것을 어떻게 해결 할 수 있을지 고민함.
Cloudfront에 oac를 사용함으로써 단일 트래픽 경로를 이용해 해결할 수 있다는 것을 알았음.
CloudFront에 Signed Cookies를 사용하여 웹 어플리케이션이 생성한 쿠키를 사용하여 요청이 오리진에서 생성된 것인지 확인 가능함.

## 🚨 트러블 슈팅
* 문제 상황

* 원인 파악

* 문제 해결

## 📋 블로깅 & 레퍼런스
* 블로깅
  * https://jihoon555.tistory.com/58
 
* 레퍼런스 
  * https://www.fastify.io/
  * https://github.com/fastify/fastify-cli
  * https://github.com/aws-actions/amazon-ecr-login
  * https://hub.docker.com/_/mongo
